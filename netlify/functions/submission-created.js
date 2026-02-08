// Netlify background function triggered automatically when a form is submitted.
// Sends an auto-reply email to the person who submitted the contact form via Resend.
//
// Required environment variable (set in Netlify dashboard > Site settings > Environment variables):
//   RESEND_API_KEY - API key from https://resend.com

// To use the custom domain address, verify thenaturalonestheatre.com in the Resend dashboard
// and add the DNS records Resend provides to your Netlify DNS settings.
// Until the domain is verified, fall back to Resend's shared test address.
const REPLY_FROM = process.env.RESEND_FROM_EMAIL || 'The Natural Ones <onboarding@resend.dev>';

export async function handler(event) {
  const { payload } = JSON.parse(event.body);

  // Only auto-reply to the "contact" form
  if (payload.form_name !== 'contact') {
    return { statusCode: 200, body: 'Not a contact form submission' };
  }

  const { name, email, message } = payload.data;

  if (!email) {
    console.log('No email address in submission, skipping auto-reply');
    return { statusCode: 200, body: 'No email to reply to' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not set');
    return { statusCode: 500, body: 'Email service not configured' };
  }

  const firstName = name ? name.split(' ')[0] : 'Adventurer';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: REPLY_FROM,
        to: email,
        subject: 'We got your message! — The Natural Ones',
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2d1810;">
            <h2 style="font-family: Georgia, serif; color: #3d6b1e; margin-bottom: 4px;">
              The Natural Ones
            </h2>
            <p style="color: #8b6914; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">
              Amateur Theatre with a Critical Hit
            </p>
            <hr style="border: none; border-top: 1px solid #c9a227; margin: 24px 0;" />
            <p>Hi ${firstName},</p>
            <p>
              Thanks for reaching out! Your message has landed safely in our inbox
              (no failed perception checks this time).
            </p>
            <p>We'll get back to you as soon as we can.</p>
            <p style="color: #6b5b4a; font-size: 14px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0d5c3;">
              <strong>Your message:</strong><br />
              <em>${(message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />')}</em>
            </p>
            <p style="color: #6b5b4a; font-size: 13px; margin-top: 24px;">
              — The Natural Ones<br />
              <a href="https://thenaturalones.co.uk" style="color: #8b6914;">thenaturalones.co.uk</a>
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
      return { statusCode: res.status, body: error };
    }

    console.log(`Auto-reply sent to ${email}`);
    return { statusCode: 200, body: 'Auto-reply sent' };
  } catch (err) {
    console.error('Failed to send auto-reply:', err);
    return { statusCode: 500, body: 'Failed to send auto-reply' };
  }
}
