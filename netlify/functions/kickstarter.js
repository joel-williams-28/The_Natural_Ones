// Netlify serverless function to fetch Kickstarter campaign data
const KICKSTARTER_URL = 'https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe';
const KICKSTARTER_JSON_URL = KICKSTARTER_URL + '.json';

export async function handler(event, context) {
  try {
    // Try the JSON endpoint first - Kickstarter provides this
    const jsonResponse = await fetch(KICKSTARTER_JSON_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (jsonResponse.ok) {
      const data = await jsonResponse.json();

      if (data.project) {
        const project = data.project;
        const pledged = project.pledged || null;
        const goal = project.goal || null;
        const backers = project.backers_count || null;
        const deadline = project.deadline || null;

        let daysRemaining = null;
        if (deadline) {
          const end = new Date(deadline * 1000);
          const now = new Date();
          const diffTime = end - now;
          daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        const percentFunded = (pledged && goal && goal > 0)
          ? (pledged / goal) * 100
          : null;

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
          },
          body: JSON.stringify({
            pledged,
            goal,
            daysRemaining,
            backers,
            percentFunded,
            currency: project.currency || 'GBP',
            lastUpdated: new Date().toISOString()
          })
        };
      }
    }

    // Fallback: scrape the HTML page
    const response = await fetch(KICKSTARTER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Kickstarter page: ${response.status}`);
    }

    const html = await response.text();

    let pledged = null;
    let goal = null;
    let daysRemaining = null;
    let backers = null;
    let percentFunded = null;

    // Try to find data-initial attribute (React app data)
    const dataInitialMatch = html.match(/data-initial="([^"]+)"/);
    if (dataInitialMatch) {
      try {
        const decoded = dataInitialMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'");
        const data = JSON.parse(decoded);
        if (data.project) {
          pledged = data.project.pledged ? parseFloat(data.project.pledged) : null;
          goal = data.project.goal ? parseFloat(data.project.goal) : null;
          backers = data.project.backersCount || null;
          percentFunded = data.project.percentFunded || null;

          if (data.project.deadlineAt) {
            const end = new Date(data.project.deadlineAt * 1000);
            const now = new Date();
            const diffTime = end - now;
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          }
        }
      } catch (e) {
        console.log('data-initial parse failed:', e.message);
      }
    }

    // Regex fallbacks
    if (pledged === null) {
      const pledgedMatch = html.match(/"pledged":\s*([\d.]+)/);
      if (pledgedMatch) pledged = parseFloat(pledgedMatch[1]);
    }

    if (goal === null) {
      const goalMatch = html.match(/"goal":\s*([\d.]+)/);
      if (goalMatch) goal = parseFloat(goalMatch[1]);
    }

    if (daysRemaining === null) {
      const daysMatch = html.match(/(\d+)\s*days?\s*to go/i);
      if (daysMatch) daysRemaining = parseInt(daysMatch[1]);
    }

    if (percentFunded === null && pledged !== null && goal !== null && goal > 0) {
      percentFunded = (pledged / goal) * 100;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify({
        pledged,
        goal,
        daysRemaining,
        backers,
        percentFunded,
        currency: 'GBP',
        lastUpdated: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error fetching Kickstarter data:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to fetch Kickstarter data',
        message: error.message
      })
    };
  }
}
