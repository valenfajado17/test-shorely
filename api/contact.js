// /api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return 
  res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const { name, email, message, _honey } = JSON.parse(req.body || '{}');
    if (_honey) return res.status(200).json({ ok:true }); // honeypot
    if (!name || !email || !message) {
      return res.status(400).json({ ok:false, error:'Missing fields' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT || 2525),
      secure: false, // 2525 uses STARTTLS; keep false
      auth: { user: process.env.MAILTRAP_USER, pass: process.env.MAILTRAP_PASS }
    });

    // 1) Owner mail (lands in Mailtrap inbox when using Email Testing)
    await transporter.sendMail({
      from: '"Shorely Website" <no-reply@shorely.com>',
      to: process.env.CONTACT_TO,
      subject: 'Shorely — New message from website',
      html: `
        <table style="font-family:Inter,Segoe UI,Arial,sans-serif;font-size:14px">
          <tr><td><strong>Name:</strong></td><td>${escape(name)}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${escape(email)}</td></tr>
          <tr><td style="padding-top:8px" colspan="2"><strong>Message</strong><br>${escape(message).replace(/\n/g,'<br>')}</td></tr>
        </table>
      `
    });

    // 2) Auto‑reply to the sender (also lands in Mailtrap during testing)
    await transporter.sendMail({
      from: '"Shorely" <no-reply@shorely.com>',
      to: email,
      subject: 'Thanks for reaching out to Shorely',
      text:
`Thanks for reaching out to Shorely!

We’ve received your message and will get back to you soon.
If you’d like to add anything, just reply to this email.

— Shorely 🌊`
    });

    res.status(200).json({ ok:true });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ ok:false, error:'Email failed' });
  }
};

function escape(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[m])); }
a