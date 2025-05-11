import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const globalConfig = {

    // environment and port
    environment: process.env.NODE_ENV,
    port: process.env.PORT,

    // MySQL
    mysqlDev: process.env.DB_URI_DEV,
    mysqlProd: process.env.DB_URI_PROD,
    DB_Host: process.env.DB_HOST,
    DB_User: process.env.DB_USER,
    DB_Password: process.env.DB_PASSWORD,
    DB_Name: process.env.DB_NAME,
    DB_Port: process.env.DB_PORT,

    // jwt secret key
    jwtSecret: process.env.JWT_SECRET,

    // SMTP
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD
    },

    // Frontend URL
    frontendUrl: process.env.FRONTEND_URL
}

export default globalConfig;