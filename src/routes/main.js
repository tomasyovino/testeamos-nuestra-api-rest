import { Router } from "express";
import { listUserByIdController } from "../controllers/User.controller.js";
import { getProductsController } from "../controllers/Products.controller.js";
import { auth } from "../middlewares/auth.js";

const mainRouter = Router();

mainRouter.get("/", auth, async (req, res) => {
    const userData = await listUserByIdController(req.user._id);
    const dataProd = await getProductsController();
    
    res.render("main", {
      data: userData,
      productData: dataProd,
    });
});

export default mainRouter;