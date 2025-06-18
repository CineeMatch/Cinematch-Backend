import nodemailer from "nodemailer";
import dotenv from "dotenv";
import globalConfig from "../configs/globalConfig.js";

dotenv.config();

const sendMail = async(to,subject,htmlContent) => {

    const transporter = nodemailer.createTransport({
        host: globalConfig.smtp.host,
        port: globalConfig.smtp.port,
        service: "gmail",
        auth: {
            user: globalConfig.smtp.email,
            pass: globalConfig.smtp.password,
        },

    });

    const mailOptions = {
        from: `${globalConfig.smtp.fromName} <${globalConfig.smtp.fromEmail}>`,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("While mail send create error", error);
        throw new Error(`While mail send create error ${error.message}`);
    };
};

export default sendMail;