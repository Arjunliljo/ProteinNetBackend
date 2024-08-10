import express from "express";
import authController from "../Controllers/authController.js";
import userController from "../Controllers/userController.js";

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.protect, authController.logout);
router.delete("/deleteAllUsers", userController.deleteAllUsers);

router.get("/getme", authController.protect, userController.getMe);
router.get("/update-me", authController.protect, userController.updateMe);
router.get("/delete-me", authController.protect, userController.deleteMe);

router.route("/").get(authController.protect, userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

export default router;
