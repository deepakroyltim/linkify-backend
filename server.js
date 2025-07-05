import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UrlRouter from "./routes/urlShortener.js";
import AuthRouter from "./routes/auth.js";
import QRCodeRouter from "./routes/qrCode.js";

const app = express();
dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());
const port = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo DB Atlas connected");
  })
  .catch((error) => {
    console.log("Connection Error:", error.message);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ status: true, message: "Server is up and running!" });
});
app.use("/urlshortener/", UrlRouter);
app.use("/auth/", AuthRouter);
app.use("/qrcode/", QRCodeRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
