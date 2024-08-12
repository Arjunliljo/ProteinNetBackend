import mongoose from "mongoose";

const reviewShema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  description: {
    type: String,
    required: [true, "Review must have a description..."],
  },
});

const Review = mongoose.model("Reveiw", reviewShema);

export default Review;
