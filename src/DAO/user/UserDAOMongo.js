import MongoDbContainer from "../../containers/MongoDbContainer.js";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/User.js";
import MessageDAO from "../MessageDAO.js";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class UsersDAOMongo extends MongoDbContainer {
    constructor() {
        super(UserModel);
    };
    
    static createInstance() {
        if (!instance) {
            instance = new UsersDAOMongo();
        }
        return instance;
    }

    async createUser(username, password, email, direction, birthDate, phoneNumber, file) {
        try {
            const newUser = new UserModel({
                username,
                password,
                email,
                direction,
                birthDate,
                phoneNumber,
            });
    
            if(file) {
                newUser.setImgUrl(file);
            };
    
            await newUser.save();
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async findById(id) {
        try {
            const user = await UserModel.findById(id).lean();
            return user;
        } catch (err) {
            errorLogger.error(err);
        }
    };

    async userDeserialize(id) {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (err) {
            errorLogger.error(err);
        }
    }

    async registerUser(username, password, email, direction, birthDate, phoneNumber, file, res) {
        try {
            const messageDAO = new MessageDAO();
            const checkUser = await UserModel.findOne({ email }, async (err, user) => {
                if (err) errorLogger.error(err);
                if (user) res.render("register-error");
                if (!user) {
                    this.createUser(username, password, email, direction, birthDate, phoneNumber, file);
                    messageDAO.newUserAdviceEmail(username, password, email, direction, birthDate, phoneNumber);
                    res.redirect("/api/login");
                };
            });
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async checkIfUserExist(email, password, done) {
        try {
            UserModel.findOne({ email }, (err, user) => {
                if (err) console.log(err);
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, isMatch) => {
                  if (err) console.log(err);
                  if (isMatch) return done(null, user);
                  return done(null, false);
                });
            });
        } catch (err) {
            errorLogger.error(err);
        };
    };
};

export default UsersDAOMongo;