require('dotenv').config();

module.exports = {
 
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    api_key: process.env.API_KEY,
    smtp:{
         host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD
    },
    frontend_url:process.env.FRONTEND_URL
 


};
