import { getCartById, addProductToCart, deleteProductFromCart } from "../services/cart.services.js";

async function getCartByIdController(id) {
    return await getCartById(id);
};

async function addProductToCartController(userID, productID) {
    return await addProductToCart(userID, productID);
};

async function deleteProductFromCartController(userID, productID) {
    return await deleteProductFromCart(userID, productID);
};

export { getCartByIdController, addProductToCartController, deleteProductFromCartController };