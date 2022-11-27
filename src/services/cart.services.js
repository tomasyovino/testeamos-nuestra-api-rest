import CartsDAOMongo from "../DAO/cart/CartsDAOMongo.js";
import CartsDAOFile from "../DAO/cart/CartsDAOFile.js";
import CartsDAOMemory from "../DAO/cart/CartsDAOMemory.js";

let cartsDAO;
const PERS = process.env.PERS || "mongodb";

switch (PERS) {
    case "mongodb":
        cartsDAO = CartsDAOMongo.createInstance();
        break;
    case "file":
        cartsDAO = CartsDAOFile.createInstance();
        break;
    case "memory":
        cartsDAO = CartsDAOMemory.createInstance();
        break;
};

async function getCartById(id) {
    return await cartsDAO.findCart(id);
};

async function addProductToCart(userID, productID) {
    return await cartsDAO.addProduct(userID, productID)
}

async function deleteProductFromCart(userID, productID) {
    return await cartsDAO.deleteProduct(userID, productID);
};

export { getCartById, addProductToCart, deleteProductFromCart }