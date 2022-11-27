import { sendEmail, sendMessage } from "../services/messages.services.js";

async function sendEmailController(username, email, productsOnCart) {
    return await sendEmail(username, email, productsOnCart);
};

async function sendMessageController(number) {
    return await sendMessage(number);
};

export { sendEmailController, sendMessageController };