import FileContainer from "../../containers/FileDBContainer.js";
import { promises as fs } from "fs";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class ProductsDAOFile extends FileContainer {
    constructor() {
        super("./db/products.txt")
    }

    static createInstance() {
        if (!instance) {
            instance = new ProductsDAOFile();
        }
        return instance;
    }

    async save(elem) {
        try {
            let content = await fs.readFile(this.route, "utf-8");
            const defaultState = "[]";

            
            let timestamp = Date.now();
            let description = "Lorem ipsum dolor sit amet, constantinople...";
            let code = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                let r = (timestamp + Math.random() * 16) % 16 | 0;
                timestamp = Math.floor(timestamp / 16);
                return (c == "x" ? r : (r & 0*3 | 0*8)).toString(16);
            });
            let quantity = 1;
            const product = { title: elem.title, price: elem.price, thumbnail: elem.thumbnail, timestamp, description, code, quantity  };
    
            if (content == "") {
                await fs.writeFile(this.route, defaultState);
                content = "[]";
            }
            const data = await JSON.parse(content);
            if (data.length > 0) {
                data.push({ ...product, _id: data[data.length - 1]._id + 1 });
            } else {
                data.push({ ...product, _id: 1 });
            }

            await fs.writeFile(this.route, JSON.stringify(data, null, 2));   
        } catch (err) {
            errorLogger(err);
        }
    };

    async update(elem) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);

            const product = await this.list(elem.id);
            product.title = elem.title;
            product.price = elem.price;
            product.thumbnail = elem.thumbnail;

            const index = await data.findIndex((prod, i) => {
                if(prod._id == elem._id) {
                    return true;
                }
            });

            data[index] = product;

            await fs.writeFile(this.route, JSON.stringify(data, null, 2));
        } catch (err) {
            errorLogger(err);
        }
    };
};

export default ProductsDAOFile;