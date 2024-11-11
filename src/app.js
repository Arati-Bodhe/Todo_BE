// import cookieParser from "cookie-parser";
// import express from "express";
// import cors from "cors";
// const app = express();
// //miidleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true
// }));
// app.use(cookieParser());
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// //middleware end

// //routes import
// import  userRouter from "./routes/user.route.js";

// console.log("hello");

// //
// app.use('/api/v1/users',userRouter);
// export { app };

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

//routes declaration
app.use("/api/v1/users",userRouter)
export{app};