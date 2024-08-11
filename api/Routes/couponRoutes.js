import express from "express";
import couponController from "../Controllers/couponController.js";

const router = express.Router();

router.post("/assign/:userId/:couponId", couponController.assignCouponToUser);

router
  .route("/")
  .get(couponController.getAllCoupon)
  .post(couponController.createCoupon);
router
  .route("/:id")
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

export default router;
