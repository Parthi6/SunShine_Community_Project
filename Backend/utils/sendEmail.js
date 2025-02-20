import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Message from ${options.name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${options.name}</p>
            <p><strong>Email:</strong> ${options.email}</p>
            <p><strong>Phone:</strong> ${options.phone}</p>
            <p><strong>Message:</strong></p>
            <p>${options.message}</p>
        `
    };

    // Auto-reply to sender with logo
    const autoReplyOptions = {
        from: `"SUNSHINE PRE SCHOOL" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: "Thank You for Contacting Sunshine Pre School",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXAhW1xfrsoNDOgMT8ndQDvMKmuj6dtQmDA&s" 
                         alt="Sunshine Pre School Logo" 
                         style="max-width: 200px; height: auto;"
                    />
                </div>

                <h2 style="color: #ff6b6b; text-align: center;">Thank You for Contacting Us!</h2>
                
                <p>Dear ${options.name},</p>
                
                <p>Thank you for reaching out to Sunshine Pre School. We have received your message and appreciate you taking the time to contact us.</p>
                
                <p>Our team will review your message and get back to you as soon as possible.</p>
                
                <p>For your reference, here's a copy of your message:</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Your Message:</strong></p>
                    <p>${options.message}</p>
                </div>
                
                <div style="background: #fff6f6; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffe6e6;">
                    <h3 style="color: #ff6b6b; margin-top: 0;">Don't Hesitate to Contact Us</h3>
                    <p>If you have any questions or need immediate assistance, please feel free to reach out through any of these channels:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;">
                            <strong>📞 Phone:</strong> +94 123 456 789
                        </li>
                        <li style="margin: 10px 0;">
                            <strong>📧 Email:</strong> info@sunshinepre.com
                        </li>
                        <li style="margin: 10px 0;">
                            <strong>📍 Address:</strong> 123 Education Street, City
                        </li>
                        <li style="margin: 10px 0;">
                            <strong>⏰ Hours:</strong> Monday - Friday: 8:00 AM - 5:00 PM
                        </li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px;">Best Regards,<br>
                Sunshine Pre School Team</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
                    <p>This is an automated response. Please do not reply to this email.</p>
                    <p>Follow us on social media for updates and announcements!</p>
                    <div style="margin-top: 10px;">
                        <a href="#" style="color: #4267B2; margin: 0 10px;">Facebook</a>
                        <a href="#" style="color: #1DA1F2; margin: 0 10px;">Twitter</a>
                        <a href="#" style="color: #E1306C; margin: 0 10px;">Instagram</a>
                    </div>
                </div>
            </div>
        `,
        attachments: [{
            filename: 'logo.png',
            path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXAhW1xfrsoNDOgMT8ndQDvMKmuj6dtQmDA&s',
            cid: 'logo'
        }]
    };

    // Send both emails
    await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(autoReplyOptions)
    ]);
};

export default sendEmail; 