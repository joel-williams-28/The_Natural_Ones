// Netlify serverless function to fetch Kickstarter campaign data
const KICKSTARTER_URL = 'https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe';

// Helper to decode HTML entities
function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'");
}

// Fetch with timeout
async function fetchWithTimeout(url, options, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const response = await fetchWithTimeout(KICKSTARTER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    }, 15000);

    if (!response.ok) {
      throw new Error(`Failed to fetch Kickstarter page: ${response.status}`);
    }

    const html = await response.text();

    let pledged = null;
    let goal = null;
    let endDate = null;
    let backers = null;
    let percentFunded = null;
    let state = null;

    // Method 1: Extract from data-initial attribute (primary method)
    const dataInitialMatch = html.match(/data-initial="([^"]+)"/);
    if (dataInitialMatch) {
      try {
        const jsonStr = decodeHtmlEntities(dataInitialMatch[1]);
        const data = JSON.parse(jsonStr);

        if (data.project) {
          pledged = data.project.pledged;
          goal = data.project.goal;
          endDate = data.project.deadlineAt;
          backers = data.project.backersCount;
          percentFunded = data.project.percentFunded;
          state = data.project.state;
        }
      } catch (e) {
        console.error('Error parsing data-initial JSON:', e.message);
      }
    }

    // Method 2: Extract from window.current_project or similar JS objects
    if (pledged === null) {
      const currentProjectMatch = html.match(/window\.current_project\s*=\s*"([^"]+)"/);
      if (currentProjectMatch) {
        try {
          const jsonStr = decodeHtmlEntities(currentProjectMatch[1]);
          const data = JSON.parse(jsonStr);
          pledged = data.pledged || pledged;
          goal = data.goal || goal;
          endDate = data.deadline || data.deadlineAt || endDate;
          backers = data.backers_count || data.backersCount || backers;
          state = data.state || state;
        } catch (e) {
          console.error('Error parsing current_project JSON:', e.message);
        }
      }
    }

    // Method 3: Extract from JSON-LD structured data
    if (pledged === null) {
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      if (jsonLdMatch) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          // JSON-LD might contain funding info
          if (jsonLd.funding) {
            pledged = jsonLd.funding.amount || pledged;
            goal = jsonLd.funding.goal || goal;
          }
        } catch (e) {
          // JSON-LD parsing is optional
        }
      }
    }

    // Method 4: Fallback regex extraction from HTML content
    if (pledged === null) {
      // Match various Kickstarter formatting patterns
      const pledgedPatterns = [
        /class="[^"]*money[^"]*"[^>]*>£([\d,]+)/i,
        /pledged[^£]*£([\d,]+)/i,
        /"pledged":\s*([\d.]+)/i,
        /data-pledged="([\d.]+)"/i,
        /£([\d,]+)[^<]*pledged/i
      ];

      for (const pattern of pledgedPatterns) {
        const match = html.match(pattern);
        if (match) {
          pledged = parseFloat(match[1].replace(/,/g, ''));
          break;
        }
      }
    }

    if (goal === null) {
      const goalPatterns = [
        /goal[^£]*£([\d,]+)/i,
        /"goal":\s*([\d.]+)/i,
        /data-goal="([\d.]+)"/i,
        /£([\d,]+)[^<]*goal/i,
        /of\s*£([\d,]+)\s*goal/i
      ];

      for (const pattern of goalPatterns) {
        const match = html.match(pattern);
        if (match) {
          goal = parseFloat(match[1].replace(/,/g, ''));
          break;
        }
      }
    }

    if (backers === null) {
      const backersPatterns = [
        /"backersCount":\s*(\d+)/i,
        /"backers_count":\s*(\d+)/i,
        /data-backers="(\d+)"/i,
        /([\d,]+)\s*backers?/i
      ];

      for (const pattern of backersPatterns) {
        const match = html.match(pattern);
        if (match) {
          backers = parseInt(match[1].replace(/,/g, ''), 10);
          break;
        }
      }
    }

    if (endDate === null) {
      const deadlinePatterns = [
        /"deadlineAt":\s*(\d+)/i,
        /"deadline":\s*(\d+)/i,
        /data-deadline="(\d+)"/i,
        /data-end_time="(\d+)"/i
      ];

      for (const pattern of deadlinePatterns) {
        const match = html.match(pattern);
        if (match) {
          endDate = parseInt(match[1], 10);
          break;
        }
      }
    }

    // Calculate days remaining
    let daysRemaining = null;
    if (endDate) {
      const end = new Date(endDate * 1000);
      const now = new Date();
      const diffTime = end - now;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // Calculate percentage if we have the values but not the percentage
    if (percentFunded === null && pledged !== null && goal !== null && goal > 0) {
      percentFunded = (pledged / goal) * 100;
    }

    // Determine if campaign is live, ended, or successful
    const isLive = state === 'live' || (daysRemaining !== null && daysRemaining > 0);
    const isSuccessful = state === 'successful' || (percentFunded !== null && percentFunded >= 100);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      },
      body: JSON.stringify({
        pledged,
        goal,
        daysRemaining,
        backers,
        percentFunded: percentFunded !== null ? Math.round(percentFunded * 10) / 10 : null,
        currency: 'GBP',
        state: state || (isLive ? 'live' : (isSuccessful ? 'successful' : 'ended')),
        isLive,
        isSuccessful,
        lastUpdated: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching Kickstarter data:', error);

    // Return cached/fallback data on error instead of failing completely
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      },
      body: JSON.stringify({
        pledged: null,
        goal: null,
        daysRemaining: null,
        backers: null,
        percentFunded: null,
        currency: 'GBP',
        state: 'unknown',
        isLive: null,
        isSuccessful: null,
        error: true,
        errorMessage: error.message,
        lastUpdated: new Date().toISOString()
      })
    };
  }
}
