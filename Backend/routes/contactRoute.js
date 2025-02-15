import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'akci0726@gmail.com',
        pass: 'vedo erks lrms awup'
    }
});

router.post('/send', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Email to admin (you)
        const adminMailOptions = {
            from: {
                name: 'NEW MESSAGE',
                address: 'akci0726@gmail.com'
                
            },
            to: 'akci0726@gmail.com',
            replyTo: `"${name}" <${email}>`,
            subject: `New Message from ${name}`,
            headers: {
                'X-Original-From': `${name} <${email}>`,
                'X-Contact-Name': name,
                'X-Contact-Email': email
            },
            html: `
                <h2>New Message from ${name}</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Confirmation email to sender
        const senderMailOptions = {
            from: {
                name: 'Sunshine Pre School',
                address: 'akci0726@gmail.com'
            },
            to: email,
            subject: 'Thank you for contacting Sunshine Pre School',
            html: `
                <h2>Thank you for reaching out to us!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you soon.</p>
                <p>Here's a copy of your message:</p>
                <p>${message}</p>
                <br>
                <p>Best regards,</p>
                <p>Sunshine Pre School Team</p>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(senderMailOptions)
        ]);

        res.status(200).json({
            success: true,
            message: 'Emails sent successfully'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

export default router; 