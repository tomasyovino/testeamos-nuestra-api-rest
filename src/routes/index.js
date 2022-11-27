import { Router } from "express";
import { logger, warnLogger } from "../utils/loggers.js";
import loginRouter from "./login.js";
import registerRouter from "./register.js";
import logoutRouter from "./logout.js";
import mainRouter from "./main.js";
import profileRouter from "./profile.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";

const router = Router();

router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/logout", logoutRouter);
router.use("/main", mainRouter);
router.use("/profile", profileRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);



const invalidRoute = (req) => {
  const url = req.originalUrl;
  const method = req.method;
  return { error: -2, description: `Ruta ${url} inexistente. Método ${method} no implementado.` };
};

// SESSION
router.get("/", (req, res) => {
  const url = req.originalUrl;
  const method = req.method;
  
  if (req.session.nombre) {
    logger.info(`Petición en la ruta ${url}. Método ${method}.`);
    res.redirect("/api/index");
  } else {
    logger.info(`Petición en la ruta ${url}. Método ${method}.`);
    res.redirect("/api/login");
  }
});
  
router.get("/login-error", (req, res) => {
    res.render("login-error");
});

router.get("*", (req, res) => {
  const url = req.originalUrl;
  const method = req.method;

  logger.warn(`Ruta ${url} inexistente. Método ${method} no implementado.`);
  warnLogger.warn(`Ruta ${url} inexistente. Método ${method} no implementado.`);
  res.send(invalidRoute(req));
});

export default router;