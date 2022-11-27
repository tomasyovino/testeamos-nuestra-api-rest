import { listUserById, registerNewUser, checkUser, listUserDeserialize } from "../services/user.services.js";
import UserDTO from "../DTO/UserDTO.js";

async function listUserByIdController(id) {
    const user = await listUserById(id);
    return new UserDTO(user);
};

async function listUserDeserializeController(id) {
    return await listUserDeserialize(id);
};

async function registerNewUserController(username, password, email, direction, birthDate, phoneNumber, file, res) {
    return await registerNewUser(username, password, email, direction, birthDate, phoneNumber, file, res);
};

async function checkUserController(email, password, done) {
    return await checkUser(email, password, done);
};

export { listUserByIdController, registerNewUserController, checkUserController, listUserDeserializeController };