import express from "express";
import authController from "../Controllers/authController.js";
import cartController from "../Controllers/cartController.js";

const router = express.Router();

router.get("/get-my-cart", authController.protect, cartController.getMyCart);

router.route("/").get(cartController.getAllCart);
router.route("/:id").get(cartController.getCart);

export default router;
