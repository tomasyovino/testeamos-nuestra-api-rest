import { createTransport } from "nodemailer";
import twilio from "twilio";
import { errorLogger } from "../utils/loggers.js";

class MessageDAO {
    constructor() {
        this.adminEmail = "examplecoder24@gmail.com";
        this.transporter = createTransport({
            service: "gmail",
            auth: {
                user: "examplecoder24@gmail.com",
                pass: "zvybfprvfdbskakv",
            },
        });
    };

    async sendEmail(username, email, productsOnCart) {
        const transporter = this.transporter;
        const user_email = email;
        const user_username = username;
        let productList = "";
        let p;
    
        for (p in productsOnCart) {
            productList += `• ${productsOnCart[p].quantity} - ${productsOnCart[p].title}`
        };
    
        try {
            const emailContent = {
              from: "Sitio Web",
              to: user_email,
              subject: `Nuevo pedido de ${user_username} / ${user_email}`,
              text: productList,
            };
            const info = transporter.sendMail(emailContent);
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async sendMessage(number) {
        try {
            const accountSid = "AC534ba76432f965c5909ac01251df04d9";
            const authToken = "0175e38ffd54d994f88e458f07be5b69";
        
            const client = twilio(accountSid, authToken);
        
            const message = await client.messages.create({
              body: "Su pedido ha sido recibido y se encuentra en proceso de envío",
              from: "+14699604183",
              to: `+${number}`,
            });
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async newUserAdviceEmail(username, password, email, direction, birthDate, phoneNumber) {
        try {
            const USER_MAIL = this.adminEmail; // PASS Coderhouse.123456
            const transporter = this.transporter;

            const emailContent = {
                from: "Sitio Web",
                to: USER_MAIL,
                subject: "Nuevo registro",
                text: `Usuario: ${username}
                      Contraseña: ${password}
                      Email: ${email}
                      Dirección: ${direction}
                      F. de nacimiento: ${birthDate}
                      Teléfono: ${phoneNumber}`,
            };

            const info = await transporter.sendMail(emailContent);
        } catch (err) {
            errorLogger.error(err);
        };
    };
}

export default MessageDAO;