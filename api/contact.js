const nodemailer = requird('nodemailer');

module.exports = async (req, res) => {
    if (req.method != 'POST'){
        res.status(405).json({ ok: false, error: 'Method not allowed'});
        return;
    }

    try {
        const { name, email, message, _honey } = JSON.parse(req.body || '{}');

        if (_honey) { return res.status(200).json({ ok: true});}

        if (!name || !email || !message) {
            return res.status(400).json({ ok: false, error: "Missing filds"});
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(port.env.MAILTRAP_PORT || 2525),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        // onwer email
        await transporter.sendMail({
            from: '"Shorely Website" <no-reply@shorely.com>',
            to: process.env.CONTACT_TO, 
            subject: "Shorely - New message form website",
            html: `
                <table style="font-family:Inter,Segoe UI,Arial,sans-serif;font-size:14px">
                <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${escapeHtml(email)}</td></tr>
                <tr><td style="padding-top:8px" colspan="2"><strong>Message</strong><br>${escapeHtml(message).replace(/\n/g,'<br>')}</td></tr>
                </table> `
        });

        // Auto-reply to sender (user)
        await transporter.sendMail({
            from: '"Shorely" <no-reply@shorely.com>',
            to: email, 
            subject: "Thanks for reaching out to Shorely ",
            text: `
                Thanks for reaching out to Shorely  👋

                We’ve received your message. Your inquiry is currently being directed to the appropriate team member. 
                If we find your request interesting, you can expect a response within 48 to 72 hours.

                We appreciate your patience and look forward to assisting you.
                — Shorely 🌊 `
        });

        res.status(200).json({ ok: true});
    } catch (err) {
        console.error('Mail error', err);
        res.status(500).json({ ok: false, error: "Email failed" });
    }
};

function escapeHtml(s = ''){
    return s.replace(/[&<>"']/g, m => (
        { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
    ));
}