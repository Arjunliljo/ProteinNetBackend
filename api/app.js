import express from "express";
import cors from "cors";
import productsRoute from "./Routes/productsRoute.js";
import AppError from "./Utilities/appError.js";
import globalErrorHandler from "./Utilities/globalErrorhandler.js";
import userRoute from "./Routes/usersRoute.js";
import cookieParser from "cookie-parser";
import { otpToPhone } from "./Utilities/otpGenerate.js";

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

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

export default app;
