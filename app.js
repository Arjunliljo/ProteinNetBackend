import express from "express";
const app = express();

///Application Level MiddleWares
app.use(express.json());

app.use("api/v1/products");

export default app;
