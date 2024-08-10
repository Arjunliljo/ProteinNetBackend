import express from "express";
import authController from "../Controllers/authController.js";
import userController from "../Controllers/userController.js";

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.delete("/deleteAllUsers", userController.deleteAllUsers);

router.route("/").get(authController.protect, userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

export default router;
