import MongoDbContainer from "../../containers/MongoDbContainer.js";
import { ProductModel } from "../../models/Product.js";
import { errorLogger } from "../../utils/loggers.js";

let instance = null;

class ProductsDAOMongo extends MongoDbContainer {
    constructor(){
        super(ProductModel);
    }

    static createInstance() {
        if (!instance) {
            instance = new ProductsDAOMongo();
        }
        return instance;
    }

    async save(obj) {
        try {
            const newProduct = await ProductModel(obj);
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (err) {
            errorLogger.error(err);
        }
    }
}

export default ProductsDAOMongo;