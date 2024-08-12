import express from "express";
import reviewController from "../Controllers/reviewController";

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
