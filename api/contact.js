import nodemailer from 'nodemailer'

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const { name, email, service, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Please provide your name, email address, and project message.',
      })
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
    const smtpPort = Number(process.env.SMTP_PORT || 465)
    const smtpUser =
      process.env.SMTP_USER ||
      process.env.GMAIL_USER ||
      process.env.EMAIL_USER
    const smtpPass =
      process.env.SMTP_PASS ||
      process.env.GMAIL_APP_PASSWORD ||
      process.env.GMAIL_PASS ||
      process.env.EMAIL_PASS
    const smtpTo = process.env.SMTP_TO || smtpUser || 'kramzzzy.ebio@gmail.com'

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        error:
          'Google SMTP credentials (SMTP_USER / SMTP_PASS) are not configured in the environment yet.',
      })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const safeName = escapeHtml(name.trim())
    const safeEmail = escapeHtml(email.trim())
    const safeService = escapeHtml((service || 'General AI / Web Inquiry').trim())
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br />')

    await transporter.sendMail({
      from: `"${name.trim().replace(/"/g, '')} via KramZ Portfolio" <${smtpUser}>`,
      to: smtpTo,
      replyTo: email.trim(),
      subject: `[KramZ Portfolio] ${service || 'Project Inquiry'} — ${name.trim()}`,
      text: [
        `New Project Inquiry from KramZ Portfolio`,
        `----------------------------------------`,
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Service: ${service || 'General AI / Web Inquiry'}`,
        ``,
        `Message:`,
        message.trim(),
      ].join('\n'),
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f8fafc; border: 1px solid rgba(2, 25, 234, 0.45); border-radius: 16px; padding: 28px;">
          <div style="border-left: 3px solid #0219EA; padding-left: 14px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 20px; color: #ffffff;">New Project Inquiry</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #4f6bff;">${safeService}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 110px;">Client Name:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Reply Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #4f6bff; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Category:</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${safeService}</td>
            </tr>
          </table>
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SMTP send error:', err)
    return res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : 'Failed to send message via Google SMTP.',
    })
  }
}
