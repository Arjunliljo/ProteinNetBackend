import express from "express";
import authController from "../Controllers/authController.js";
import userController from "../Controllers/userController.js";

const router = express.Router();

router.post("/sign-up", authController.signUp);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

export default router;
