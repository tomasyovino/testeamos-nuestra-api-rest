import { Router } from "express";
import { listUserByIdController } from "../controllers/User.controller.js";
import { auth } from "../middlewares/auth.js";

const profileRouter = Router();

profileRouter.get("/", auth, async (req, res) => {
    const userData = await listUserByIdController(req.user._id);
    
    res.render("profile", {
      data: userData,
    });
});

export default profileRouter;