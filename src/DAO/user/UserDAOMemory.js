import MemoryContainer from "../../containers/MemoryDBContainer.js";
import MessageDAO from "../MessageDAO.js";
import bcrypt from "bcrypt";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class UsersDAOMemory extends MemoryContainer {
    static createInstance() {
        if (!instance) {
            instance = new UsersDAOMemory();
        }
        return instance;
    }

    async createUser(username, password, email, direction, birthDate, phoneNumber, file) {
        try {
            const HOST = 'http://localhost';
            const PORT = process.env.PORT || 3000;
            const user = {
                username,
                password,
                email,
                direction,
                birthDate,
                phoneNumber,
                imgUrl: `${HOST}:${PORT}/img/${file}`
            };

            return await this.save(user);
        } catch (err) {
            errorLogger(err)
        };
    };

    async findById(id) {
        try {
            const user = await this.list(id);
            return user;
        } catch (err) {
            errorLogger(err);
        };
    };

    async userDeserialize(id) {
        try {
            const user = await this.list(id);
            return user;
        } catch (err) {
            errorLogger(err);
        };
    };

    async registerUser(username, password, email, direction, birthDate, phoneNumber, file, res) {
        try {
            const checkUser = await this.elements.find(elem => elem.email == email);
            const messageDAO = new MessageDAO();
            if (checkUser) res.render("register-error");
            if(!checkUser) {
                this.createUser(username, password, email, direction, birthDate, phoneNumber, file);
                messageDAO.newUserAdviceEmail(username, password, email, direction, birthDate, phoneNumber);
                res.redirect("/api/login");
            };
        } catch (err) {
            errorLogger(err)
        };
    };

    async checkIfUserExist(email, password, done) {
        try {
            const checkUser = await this.elements.find(elem => elem.email == email);
            if (!checkUser) return done(null, false);
            bcrypt.compare(password, checkUser.password, (err, isMatch) => {
                if (err) errorLogger(err);
                if (isMatch) return done(null, checkUser);
                return done(null, false);
            });
        } catch (err) {
            errorLogger.error(err);
        };
    };
};

export default UsersDAOMemory;