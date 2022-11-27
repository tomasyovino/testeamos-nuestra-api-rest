import MemoryContainer from "../../containers/MemoryDBContainer.js";
import ProductsDAOMemory from "../product/ProductsDAOMemory.js";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class CartsDAOMemory extends MemoryContainer {
    async save(id) {
        const cart = {
            user: id,
            products: [],
        };
        return super.save(cart);
    };

    static createInstance() {
        if (!instance) {
            instance = new CartsDAOMemory();
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

    async addProduct(id_user, id_prod) {
        try {
            const productDAO = new ProductsDAOMemory();
            const cart = await this.elements.find(elem = elem.user == id_user);
            const product = await productDAO.list(id_prod);
            if (cart !== undefined) {
                await cart.products.push(product);
            } else {
                let cartNotExists = { message: "El carrito indicado no existe" };
                return cartNotExists;
            }
        } catch (err) {
            errorLogger(err);
        }
    }

    async deleteProduct(idCart, idProd) {
        try {
            const cart = await this.list(idCart);
            await cart.products.forEach((product, i) => {
                if (product.id == idProd) cart.products.splice(i, 1);
            });
        } catch (err) {
            errorLogger(err);
        }
    };
}

export default CartsDAOMemory;