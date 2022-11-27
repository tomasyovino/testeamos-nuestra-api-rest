import { Router } from "express";
import { registerNewUserController } from "../controllers/User.controller.js";
import path from "path";
import multer from "multer";

const registerRouter = Router();

const storage = multer.diskStorage({
  destination: "./src/public/img",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

registerRouter.use(multer({
  storage: storage,
  dest: "./src/public/img",
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: El archivo debe ser una imágen soportada");
    }
  }
}).single("image"));

registerRouter.get("/", (req, res) => {
    res.render("register");
});
  
registerRouter.post("/", (req, res) => {
    const { username, password, email, direction, birthDate, phoneNumber } = req.body;
    const { filename } = req.file;

    registerNewUserController(username, password, email, direction, birthDate, phoneNumber, filename, res);
});

export default registerRouter;