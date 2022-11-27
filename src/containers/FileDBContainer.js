import { promises as fs } from "fs";
import { errorLogger } from "../utils/loggers.js";

class FileContainer {
    constructor(route) {
        this.route = route;
    }

    async listAll() {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);
            
            return data;
        } catch (err) {
            errorLogger(err);
        }
    };

    async list(id) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);
            const findElem = await data.find((elem) => elem._id == id);
            
            return findElem;
        } catch (err) {
            errorLogger(err);
        }
    };

    async delete(id) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);
            const elem = await this.list(id);
            
            data.forEach((elem, i) => {
                if (elem._id == id) data.splice(i, 1);
            })

            const index = await data.findIndex((elem, i) => {
                if(elem._id == id) {
                    return true;
                }
            });
            
            data[index] = elem;
            await fs.writeFile(this.route, JSON.stringify(data, null, 2));    
        } catch (err) {
            errorLogger(err);
        }
    }
};

export default FileContainer;