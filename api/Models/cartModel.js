import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email phone" });
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
