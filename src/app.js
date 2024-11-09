import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const app = express();
//miidleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//middleware end
export { app };