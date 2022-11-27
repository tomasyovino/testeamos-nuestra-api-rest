import { promises as fs } from "fs";
import FileContainer from "../../containers/FileDBContainer.js";
import ProductsDAOFile from "../product/ProductsDAOFile.js";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class CartsDAOFile extends FileContainer {
    constructor() {
        super("./db/carts.txt")
    };

    static createInstance() {
        if (!instance) {
            instance = new CartsDAOFile();
        }
        return instance;
    }

    async listProducts(id) {
        try {
            const targetCart = await this.list(id);
            const cartListProducts = targetCart.products;
            
            return cartListProducts;    
        } catch (err) {
            errorLogger(err);
        }
    };

    async save(id) {
        try {
            let content = await fs.readFile(this.route, "utf8");
            let timestamp = Date.now();
            const defaultState = "[]";
            const cart = { timestamp, products:[], user: id };

            if (content == "") {
                await fs.writeFile(this.route, defaultState);
                content = "[]";
            }
            const data = await JSON.parse(content);
            if (data.length > 0) {
                data.push({ ...cart, _id: data[data.length - 1]._id + 1 });
            } else {
                data.push({ ...cart, _id: 1 });
            }

            await fs.writeFile(this.route, JSON.stringify(data, null, 2));
        } catch (err) {
            errorLogger(err);
        }
    };

    async addProduct(user_id, prod_id) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);
            const productDAO = new ProductsDAOFile();
    
            const cart = await this.elements.find(elem = elem.user == user_id);
            const product = await productDAO.list(prod_id)
            if (cart !== undefined) {
                await cart.products.push(product);
            } else {
                let cartNotExists = { message: "El carrito indicado no existe" };
                
                return cartNotExists;
            }

            const index = await data.findIndex((elem, i) => {
                if(elem.user == user_id) {
                    return true;
                }
            });
            
            data[index] = cart;
            await fs.writeFile(this.route, JSON.stringify(data, null, 2));
        } catch (err) {
            errorLogger(err);
        }
    }

    async deleteProduct(idCart, idProd) {
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const data = await JSON.parse(content);

            const cart = await this.list(idCart);
            await cart.products.forEach((product, i) => {
                if (product.id == idProd) cart.products.splice(i, 1);
            });

            const index = await data.findIndex((elem, i) => {
                if(elem.id == idCart) {
                    return true;
                }
            });
            
            data[index] = cart;
            await fs.writeFile(this.route, JSON.stringify(data, null, 2));
        } catch (err) {
            errorLogger(err);
        }
    };
};

export default CartsDAOFile;