// Netlify serverless function to fetch Kickstarter campaign data
// Using Kickstarter's JSON API endpoint which is more reliable than HTML scraping

const KICKSTARTER_API_URL = 'https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe/stats.json?v=1';
const KICKSTARTER_PROJECT_URL = 'https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe.json';

// Known campaign details (fallback when API doesn't provide them)
const CAMPAIGN_GOAL = 3000; // £3,000 goal
const CAMPAIGN_DEADLINE = 1772594640; // March 2, 2026 19:24 UTC - Campaign end date

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

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.kickstarter.com/',
    'Origin': 'https://www.kickstarter.com'
  };

  let pledged = null;
  let goal = null;
  let endDate = null;
  let backers = null;
  let percentFunded = null;
  let state = null;

  try {
    // Method 1: Try the project JSON endpoint
    const projectResponse = await fetchWithTimeout(KICKSTARTER_PROJECT_URL, { headers }, 15000);

    if (projectResponse.ok) {
      const projectData = await projectResponse.json();

      if (projectData) {
        // The response structure varies - check for nested 'project' or direct properties
        const project = projectData.project || projectData;

        // Log the response structure for debugging
        console.log('Kickstarter API response keys:', Object.keys(project));

        pledged = project.pledged || project.usd_pledged || 0;
        goal = project.goal || 0;
        endDate = project.deadline;
        backers = project.backers_count;
        state = project.state;

        // Capture percent_funded directly from API if available
        if (project.percent_funded !== undefined) {
          percentFunded = project.percent_funded;
        }

        // Handle currency conversion if needed (Kickstarter sometimes returns in USD)
        if (project.currency && project.currency !== 'GBP' && project.fx_rate) {
          // Convert if we have the rate
          pledged = pledged * project.fx_rate;
        }

        // Some responses have converted_pledged_amount
        if (project.converted_pledged_amount) {
          pledged = project.converted_pledged_amount;
        }

        console.log('Extracted data:', { pledged, goal, percentFunded, backers, state });
      }
    }
  } catch (e) {
    console.log('Project JSON fetch failed, trying stats endpoint:', e.message);
  }

  // Method 2: Try the stats endpoint if project endpoint failed
  if (pledged === null) {
    try {
      const statsResponse = await fetchWithTimeout(KICKSTARTER_API_URL, { headers }, 15000);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();

        // Log full response to see structure
        console.log('Stats API full response:', JSON.stringify(statsData, null, 2));

        if (statsData && statsData.project) {
          const proj = statsData.project;

          // Parse pledged as float (API returns string like "350.0")
          pledged = parseFloat(proj.pledged) || 0;

          // Stats endpoint doesn't include goal, use fallback
          goal = parseFloat(proj.goal) || CAMPAIGN_GOAL;

          backers = parseInt(proj.backers_count, 10) || 0;

          // Stats endpoint doesn't include deadline, use fallback
          endDate = proj.deadline || CAMPAIGN_DEADLINE;
          state = proj.state;

          // Capture percent_funded from stats endpoint
          if (proj.percent_funded !== undefined) {
            percentFunded = parseFloat(proj.percent_funded);
          }

          console.log('Stats endpoint data:', { pledged, goal, percentFunded, backers, state });
        }
      }
    } catch (e) {
      console.log('Stats endpoint fetch failed:', e.message);
    }
  }

  // If API calls failed, return error state
  if (pledged === null) {
    console.error('All Kickstarter API methods failed');

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
        errorMessage: 'Unable to fetch Kickstarter data',
        lastUpdated: new Date().toISOString()
      })
    };
  }

  // Calculate days remaining
  let daysRemaining = null;
  if (endDate) {
    const end = new Date(endDate * 1000);
    const now = new Date();
    const diffTime = end - now;
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Calculate percentage if not already provided by API
  if (percentFunded === null && pledged !== null && goal !== null && goal > 0) {
    percentFunded = (pledged / goal) * 100;
    console.log('Calculated percentFunded:', percentFunded);
  }

  // Determine campaign status
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
      pledged: Math.round(pledged),
      goal: Math.round(goal),
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
}
