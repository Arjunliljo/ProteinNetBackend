import express from "express";
import productController from "../Controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route("/:id").patch(productController.updateProduct);

export default router;
