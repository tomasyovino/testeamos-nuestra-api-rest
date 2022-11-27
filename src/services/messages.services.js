import MessageDAO from "../DAO/MessageDAO.js";

const messageDAO = new MessageDAO();

async function sendEmail(username, email, productsOnCart) {
    return await messageDAO.sendEmail(username, email, productsOnCart);
};

async function sendMessage(number) {
    return await messageDAO.sendMessage(number);
};

export { sendEmail, sendMessage };