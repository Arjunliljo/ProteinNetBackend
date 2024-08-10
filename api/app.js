import express from "express";
import cors from "cors";
import productsRoute from "./Routes/productsRoute.js";
import AppError from "./Utilities/appError.js";
import globalErrorHandler from "./Utilities/globalErrorhandler.js";
import userRoute from "./Routes/usersRoute.js";

const app = express();

///Application Level MiddleWares
app.use(cors());
app.use(express.json());

//custom middleware
app.use((req, res, next) => {
  // console.log(req.params.id);
  next();
});

app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find the ${req.originalUrl} on the page !`, 404));
});

app.use(globalErrorHandler);

export default app;
