import UsersDAOMongo from "../DAO/user/UserDAOMongo.js";
import UsersDAOFile from "../DAO/user/UserDAOFile.js";
import UsersDAOMemory from "../DAO/user/UserDAOMemory.js";
import bcrypt from "bcrypt";
import { errorLogger } from "../utils/loggers.js";
import dotenv from "dotenv";

dotenv.config();

let usersDAO;
const PERS = process.env.PERS || "mongodb";

switch (PERS) {
    case "mongodb":
        usersDAO = UsersDAOMongo.createInstance();
        break;
    case "file":
        usersDAO = UsersDAOFile.createInstance();
        break;
    case "memory":
        usersDAO = UsersDAOMemory.createInstance();
        break;
};

async function listUserById(id) {
    return await usersDAO.findById(id);
}

async function listUserDeserialize(id) {
    return await usersDAO.userDeserialize(id);
};

async function registerNewUser(username, password, email, direction, birthDate, phoneNumber, file, res) {
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        return await usersDAO.registerUser(username, hashedPassword, email, direction, birthDate, phoneNumber, file, res);
    } catch (err) {
        errorLogger.error(err);
    }
};

async function checkUser(email, password, done) {
    try {
        return await usersDAO.checkIfUserExist(email, password, done);
    } catch (err) {
        errorLogger.error(err);
    }
}

export { listUserById, registerNewUser, checkUser, listUserDeserialize };