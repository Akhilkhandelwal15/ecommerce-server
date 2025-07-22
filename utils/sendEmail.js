import nodemailer from "nodemailer";

export const sendEMail = async(to, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: `"E Commerce Support Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}