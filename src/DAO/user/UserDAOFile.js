import FileContainer from "../../containers/FileDBContainer.js";
import MessageDAO from "../MessageDAO.js";
import { promises as fs } from "fs";
import bcrypt from "bcrypt";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class UsersDAOFile extends FileContainer {
    constructor() {
        super("./db/users.txt")
    }

    static createInstance() {
        if (!instance) {
            instance = new UsersDAOFile();
        }
        return instance;
    }

    async createUser(username, password, email, direction, birthDate, phoneNumber, file) {
        try {
            const HOST = 'http://localhost';
            const PORT = process.env.PORT || 3000;
            let content = await fs.readFile(this.route, "utf-8");
            const defaultState = "[]";

            const user = {
                username,
                password,
                email,
                direction,
                birthDate,
                phoneNumber,
                imgUrl: `${HOST}:${PORT}/img/${file}`,
            };

            if (content == "") {
                await fs.writeFile(this.route, defaultState);
                content = "[]";
            }
            const data = await JSON.parse(content);
            if (data.length > 0) {
                data.push({ ...user, _id: data[data.length - 1]._id + 1 });
            } else {
                data.push({ ...user, _id: 1 });
            }

            await fs.writeFile(this.route, JSON.stringify(data, null, 2));
        } catch (err) {
            errorLogger(err)
        };
    };

    async findById(id) {
        try {
            const user = await this.list(id);
            return user;
        } catch (err) {
            errorLogger(err)
        };
    };

    async userDeserialize(id) {
        try {
            const user = await this.list(id);
            return user;
        } catch (err) {
            errorLogger(err)
        };
    };

    async registerUser(username, password, email, direction, birthDate, phoneNumber, file, res) {
        try {
            let content = await fs.readFile(this.route, "utf-8");
            const defaultState = "[]";

            if (content == "") {
                await fs.writeFile(this.route, defaultState);
                content = "[]";
            }

            const data = await JSON.parse(content);
            const checkUser = await data.find((elem) => elem.email == email);
            const messageDAO = new MessageDAO();

            if (checkUser) res.render("register-error");
            if(!checkUser) {
                this.createUser(username, password, email, direction, birthDate, phoneNumber, file);
                messageDAO.newUserAdviceEmail(username, password, email, direction, birthDate, phoneNumber);
                res.redirect("/api/login");
            };
        } catch (err) {
            errorLogger(err);
        };
    };

    async checkIfUserExist(email, password, done) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);
            const checkUser = await data.find((elem) => elem.email == email);

            if (!checkUser) return done(null, false);
            bcrypt.compare(password, checkUser.password, (err, isMatch) => {
                if (err) errorLogger(err);
                if (isMatch) return done(null, checkUser);
                return done(null, false);
            });
        } catch (err) {
            errorLogger(err);
        };
    };
};

export default UsersDAOFile;