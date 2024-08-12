import express from "express";
import reviewController from "../Controllers/reviewController.js";
import authController from "../Controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(authController.protect, reviewController.createReview);

router.route("/product/:productId").get(reviewController.getReviewsOfProduct);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
