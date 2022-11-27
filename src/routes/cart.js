import { Router } from "express";
import { listUserByIdController } from "../controllers/User.controller.js";
import { getCartByIdController, addProductToCartController, deleteProductFromCartController } from "../controllers/Carts.controller.js";
import { auth } from "../middlewares/auth.js";
import { sendEmailController, sendMessageController } from "../controllers/Messsage.controller.js";

const cartRouter = Router();

cartRouter.get("/", auth, async (req, res) => {
    const userData = await listUserByIdController(req.user._id);
    const userCart = await getCartByIdController(req.user._id);
    console.log(userData);
    const productsOnCart = userCart.products;
    res.render("cart", {
      userData: userData,
      data: productsOnCart,
    });
});

cartRouter.post("/", async (req, res) => {
  const data = await req.body;
  console.log(req.user);
  console.log(data)
  const cart = await addProductToCartController(data.userId, data.productId);
});

cartRouter.post("/buy", async (req, res) => {
  const userID = await req.user._id;
  const userData = await listUserByIdController(userID);
  const userCart = await getCartByIdController(userID);
  const productsOnCart = userCart.products;

  sendEmailController(userData.username, userData.email, productsOnCart);
  sendMessageController(userData.phoneNumber);
});

cartRouter.delete("/product", async (req, res) => {
  const data = req.body;
  console.log(data.userId, data.productId);
  const deleteProductFromCart = await deleteProductFromCartController(data.userId, data.productId);
  res.send(deleteProductFromCart);
});

export default cartRouter;