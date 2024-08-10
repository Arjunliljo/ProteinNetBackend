import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 3000;
const Db = process.env.MONGO_CONNECTION_STR;

let serverLessSystem;

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  server();
} else if (process.env.NODE_ENV === "production") {
  serverLessSystem = serverLess();
}

// server based
function server() {
  mongoose
    .connect(Db)
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

  app.listen(port, () => console.log("Server running on Port " + port));
}

// serverLess based
function serverLess() {
  let isConnected = false;

  async function connectToDb() {
    if (!isConnected) {
      await mongoose.connect(Db);
      isConnected = true;
    }
    console.log("connected vercel");
  }

  return async function handler(req, res) {
    try {
      await connectToDb();
      console.log("Server running on port 3000");
      res
        .status(200)
        .json({ status: "Success", message: "Server started successfully" });
    } catch (err) {
      console.log("Connection Error");
      res.status(500).json({ status: "Failed", message: "Server failed" });
    }
  };
}

export default serverLessSystem;
