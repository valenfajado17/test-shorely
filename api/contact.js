// /api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
 try{
    if (req.method !== 'POST') {  
        return res.status(405).json({ ok:false, error:'Method not allowed' });
    }

    let data = {};
    try {
        data = typeof req.body === 'string' ? JSON.parse(req.body || '{}')
            : (req.body || {});
    } catch (err) {
        return res.status(400).json({ ok: false, error: 'Invalid JSON body' })
    }

    const { name, email, message, _honey } = data;

    if (_honey) return res.status(200).json({ ok:true }); // honeypot
    if (!name || !email || !message) {
      return res.status(400).json({ ok:false, error:'Missing fields' });
    }

    const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS, CONTACT_TO } = process.env;
    if (!MAILTRAP_HOST || !MAILTRAP_USER || !MAILTRAP_PASS || !CONTACT_TO) {
        return res.status(500).json({ ok: false, error: 'Server email config missing' });
    }
    
    const transporter = nodemailer.createTransport({
      host: MAILTRAP_HOST,
      port: Number(MAILTRAP_PORT || 2525),
      secure: false,
      auth: { user: MAILTRAP_USER, pass: MAILTRAP_PASS }
    });

    // 1) Send owner email
    await transporter.sendMail({
        // <no-reply@shorely.com>
      from: '"Shorely Website" <valenfajardo17@gmail.com>',
      to: CONTACT_TO,
      subject: 'Shorely — New message from website',
      html: `
        <table style="font-family:Inter,Segoe UI,Arial,sans-serif;font-size:14px">
          <tr><td><strong>Name:</strong></td><td>${escape(name)}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${escape(email)}</td></tr>
          <tr><td style="padding-top:8px" colspan="2"><strong>Message</strong><br>${escape(message).replace(/\n/g,'<br>')}</td></tr>
        </table>
      `
    });

    // 2) Auto‑reply 
    await transporter.sendMail({
        // <no-reply@shorely.com>
      from: '"Shorely" <valenfajardo17@gmail.com>',
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

function escape(str=''){ 
    return str.replace(/[&<>"']/g, (m) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    ));
}
