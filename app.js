import express from "express";
import cors from "cors";
import productsRoute from "./Routes/productsRoute.js";

const app = express();

///Application Level MiddleWares
app.use(cors());
app.use(express.json());

//custom middleware
app.use((req, res, next) => {
  console.log(req.params.id); // its undefined this is in app;
  next();
});

app.use("/api/v1/products", productsRoute);

export default app;
