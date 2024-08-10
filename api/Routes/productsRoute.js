import express from "express";
import productController from "../Controllers/productController.js";
import authController from "../Controllers/authController.js";

const router = express.Router();

const filterData = (req, res, next) => {
  const allowedFields = [
    "name",
    "description",
    "price",
    "stock",
    "category",
    "image",
  ];

  const filteredBody = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      filteredBody[field] = req.body[field];
    }
  });
  req.body = filteredBody;
  next();
};

router
  .route("/")
  .get(productController.getAllProducts)
  .post(filterData, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(filterData, productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
