import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use(urlencoded({extended: true , limit:"16kb"}))

//import router
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js"
import { errorHandler } from "./utils/globalError.js";

//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/todo",todoRouter)
app.use(errorHandler);  // This should be the last middleware

export{app};