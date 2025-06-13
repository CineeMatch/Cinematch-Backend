import nodemailer from "nodemailer";
import dotenv from "dotenv";
import config from "../configs/config.cjs";

dotenv.config();

const sendMail = async(to,subject,htmlContent) => {

    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        service: "Gmail",
        auth: {
            user: config.smtp.email,
            pass: config.smtp.password,
        },

    });

    const mailOptions = {
        from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        return next(new ErrorHandler("Email couldn't send", 500));
    };
};

export default sendMail;