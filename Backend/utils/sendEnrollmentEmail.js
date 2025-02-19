import nodemailer from 'nodemailer';

const sendEnrollmentEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // If status is provided, send status update email
    if (options.status) {
        const statusEmailOptions = {
            from: `"SUNSHINE PRE SCHOOL" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: `Enrollment Application ${options.status === 'approved' ? 'Approved' : 'Status Update'} - Sunshine Pre School`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXAhW1xfrsoNDOgMT8ndQDvMKmuj6dtQmDA&s" 
                             alt="Sunshine Pre School Logo" 
                             style="max-width: 200px; height: auto;"
                        />
                    </div>

                    ${options.status === 'approved' ? `
                        <h2 style="color: #4ecdc4; text-align: center;">Congratulations! Your Enrollment is Approved</h2>
                        
                        <p>Dear ${options.parentName},</p>
                        
                        <p>We are pleased to inform you that your enrollment application for ${options.childName} has been approved! Welcome to the Sunshine Pre School family.</p>
                        
                        <div style="background: #f0fff9; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #4ecdc4;">
                            <h3 style="color: #4ecdc4; margin-top: 0;">Next Steps</h3>
                            <ol style="margin: 0; padding-left: 20px;">
                                <li>Complete the registration process by visiting our school</li>
                                <li>Submit required documents</li>
                                <li>Pay the registration fee</li>
                                <li>Attend the parent orientation session</li>
                            </ol>
                        </div>

                        <div style="background: #fff6f6; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffe6e6;">
                            <h3 style="color: #ff6b6b; margin-top: 0;">Important Information</h3>
                            <p>Please visit our school office with the following documents:</p>
                            <ul style="list-style: none; padding: 0;">
                                <li>✓ Child's birth certificate</li>
                                <li>✓ Immunization records</li>
                                <li>✓ Parent/Guardian ID</li>
                                <li>✓ Previous school records (if any)</li>
                            </ul>
                            <p><strong>Please complete the registration within 7 days to secure your child's place.</strong></p>
                        </div>
                    ` : ''}

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #4a5568; margin-top: 0;">Contact Us</h3>
                        <p>For any queries, please reach out to us:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0;">
                                <strong>📞 Phone:</strong> +94 123 456 789
                            </li>
                            <li style="margin: 10px 0;">
                                <strong>📧 Email:</strong> info@sunshinepre.com
                            </li>
                            <li style="margin: 10px 0;">
                                <strong>⏰ Office Hours:</strong> Monday - Friday: 8:00 AM - 5:00 PM
                            </li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px;">Best Regards,<br>
                    Sunshine Pre School Admissions Team</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
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

        await transporter.sendMail(statusEmailOptions);
        return;
    }

    // Email to admin about new enrollment
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Enrollment Application from ${options.parentName}`,
        html: `
            <h2>New Enrollment Application Submission</h2>
            <h3>Parent Information:</h3>
            <p><strong>Name:</strong> ${options.parentName}</p>
            <p><strong>Email:</strong> ${options.email}</p>
            <p><strong>Phone:</strong> ${options.phone}</p>
            <p><strong>Address:</strong> ${options.address}</p>

            <h3>Child Information:</h3>
            <p><strong>Child's Name:</strong> ${options.childName}</p>
            <p><strong>Date of Birth:</strong> ${options.dateOfBirth}</p>
            <p><strong>Gender:</strong> ${options.gender}</p>
            <p><strong>Class:</strong> ${options.class}</p>

            <h3>Additional Information:</h3>
            <p>${options.additionalInfo || 'None provided'}</p>
        `
    };

    // Auto-reply to parent
    const parentAutoReplyOptions = {
        from: `"SUNSHINE PRE SCHOOL" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: "Thank You for Your Enrollment Application - Sunshine Pre School",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXAhW1xfrsoNDOgMT8ndQDvMKmuj6dtQmDA&s" 
                         alt="Sunshine Pre School Logo" 
                         style="max-width: 200px; height: auto;"
                    />
                </div>

                <h2 style="color: #ff6b6b; text-align: center;">Thank You for Choosing Sunshine Pre School!</h2>
                
                <p>Dear ${options.parentName},</p>
                
                <p>Thank you for submitting an enrollment application for ${options.childName}. We are delighted that you are considering Sunshine Pre School for your child's education journey.</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #4ecdc4; margin-top: 0;">What Happens Next?</h3>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li>Our admissions team will review your application</li>
                        <li>We will contact you within 2-3 business days</li>
                        <li>We may schedule a meeting to discuss your child's enrollment</li>
                        <li>You'll receive detailed information about the next steps</li>
                    </ol>
                </div>

                <div style="background: #fff6f6; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffe6e6;">
                    <h3 style="color: #ff6b6b; margin-top: 0;">Need Assistance?</h3>
                    <p>If you have any questions about your application or our enrollment process, please contact us:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;">
                            <strong>📞 Phone:</strong> +94 123 456 789
                        </li>
                        <li style="margin: 10px 0;">
                            <strong>📧 Email:</strong> info@sunshinepre.com
                        </li>
                        <li style="margin: 10px 0;">
                            <strong>⏰ Office Hours:</strong> Monday - Friday: 8:00 AM - 5:00 PM
                        </li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px;">Best Regards,<br>
                Sunshine Pre School Admissions Team</p>
                
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
        transporter.sendMail(parentAutoReplyOptions)
    ]);
};

export default sendEnrollmentEmail; 