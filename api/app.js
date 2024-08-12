import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import productsRoute from "./Routes/productsRoute.js";
import AppError from "./Utilities/appError.js";
import globalErrorHandler from "./Utilities/globalErrorhandler.js";
import cartRoutes from "./Routes/cartRoutes.js";
import userRoute from "./Routes/usersRoute.js";
import couponRoutes from "./Routes/couponRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";

const app = express();

///Application Level MiddleWares
app.use(cors());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") app.use(express.json());

//custom middleware
app.use((req, res, next) => {
  next();
});

app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

// hangling every error in the entire application server never going to down
app.use(globalErrorHandler);

export default app;
