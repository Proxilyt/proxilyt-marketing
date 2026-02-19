import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  businessName?: string;
  subject: string;
  message: string;
  phone?: string;
}

// Allow this endpoint to be dynamic
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configure your email settings
    // Using environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: parseInt(import.meta.env.SMTP_PORT || '465'),
      secure: import.meta.env.SMTP_SECURE === 'true',
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    // Email to your business
    const businessEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.businessName ? `<p><strong>Business Name:</strong> ${escapeHtml(data.businessName)}</p>` : ''}
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
      <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <hr />
      <h3>Message:</h3>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `;

    // Email confirmation to user
const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Message Received - Proxilyt</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background-color:#4338ca; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600;">
                Message Received
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px; color:#374151; font-size:15px; line-height:1.6;">

              <p style="margin-top:0; font-size:16px;">
                Hi <strong>${escapeHtml(data.name)}</strong>,
              </p>

              <p>
                Thank you for reaching out to Proxilyt. We've received your message and our team is reviewing it.
              </p>

              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; border-left:4px solid #4338ca; margin:24px 0;">
                <tr>
                  <td style="padding:16px; font-size:14px;">
                    <strong>Status:</strong> In review<br/>
                  </td>
                </tr>
              </table>

              <!-- Message Summary -->
              <h3 style="margin-bottom:8px; font-size:14px; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280;">
                Your Message
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:6px;">
                <tr>
                  <td style="padding:16px; font-size:14px;">

                    <p style="margin:0 0 8px 0; color:#6b7280; font-size:12px; text-transform:uppercase;">
                      Subject
                    </p>
                    <p style="margin:0 0 16px 0; font-weight:600; color:#111827;">
                      ${escapeHtml(data.subject)}
                    </p>

                    <p style="margin:0 0 8px 0; color:#6b7280; font-size:12px; text-transform:uppercase;">
                      Message
                    </p>
                    <p style="margin:0;">
                      ${escapeHtml(data.message)}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Contact Info -->
              <div style="margin-top:24px; font-size:14px; color:#6b7280;">
                We will respond to: <strong>${escapeHtml(data.email)}</strong>
                ${data.phone ? `<br/>Phone: <strong>${escapeHtml(data.phone)}</strong>` : ``}
              </div>

              <!-- CTA -->
              <div style="text-align:center; margin-top:32px;">
                <a href="https://proxilyt.com/contact-us"
                   style="display:inline-block; padding:12px 24px; background-color:#4338ca; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600; font-size:14px;">
                   Visit Our Contact Page
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:24px 40px; text-align:center; font-size:13px; color:#9ca3af;">
              <strong style="color:#111827;">Proxilyt</strong><br/>
              Local SEO Analytics & Competitive Intelligence<br/><br/>
              © 2026 Proxilyt Inc. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


    // Send email to business
    await transporter.sendMail({
      from: import.meta.env.SMTP_FROM,
      to: import.meta.env.CONTACT_EMAIL || 'main.proxilyt@gmail.com',
      subject: `New Contact Form Submission: ${data.subject}`,
      html: businessEmailHtml,
      replyTo: data.email,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: import.meta.env.SMTP_FROM,
      to: data.email,
      subject: 'We received your message - Proxilyt',
      html: userEmailHtml,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
