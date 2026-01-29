// Netlify serverless function to fetch Kickstarter campaign data
const KICKSTARTER_URL = 'https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe';

export async function handler(event, context) {
  try {
    const response = await fetch(KICKSTARTER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Kickstarter page: ${response.status}`);
    }

    const html = await response.text();

    // Extract data from the page
    // Kickstarter embeds campaign data in a JSON script tag
    const dataMatch = html.match(/data-initial="([^"]+)"/);

    let pledged = null;
    let goal = null;
    let endDate = null;
    let backers = null;
    let percentFunded = null;

    if (dataMatch) {
      try {
        // The data is HTML-encoded, so we need to decode it
        const jsonStr = dataMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'");

        const data = JSON.parse(jsonStr);

        if (data.project) {
          pledged = data.project.pledged;
          goal = data.project.goal;
          endDate = data.project.deadlineAt;
          backers = data.project.backersCount;
          percentFunded = data.project.percentFunded;
        }
      } catch (e) {
        console.error('Error parsing JSON data:', e);
      }
    }

    // Fallback: try to extract from HTML if JSON parsing failed
    if (pledged === null) {
      // Try to find pledged amount in various formats
      const pledgedMatch = html.match(/pledged of £([\d,]+)/i) ||
                          html.match(/"pledged":\s*"?£?([\d,]+)"?/i) ||
                          html.match(/£([\d,]+)\s*pledged/i);
      if (pledgedMatch) {
        pledged = parseInt(pledgedMatch[1].replace(/,/g, ''), 10);
      }

      const goalMatch = html.match(/pledged of £[\d,]+ goal/i) ||
                       html.match(/"goal":\s*"?£?([\d,]+)"?/i) ||
                       html.match(/£([\d,]+)\s*goal/i);
      if (goalMatch) {
        goal = parseInt(goalMatch[1].replace(/,/g, ''), 10);
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

    // Calculate percentage if we have the values
    if (percentFunded === null && pledged !== null && goal !== null && goal > 0) {
      percentFunded = (pledged / goal) * 100;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
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
