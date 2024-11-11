// require('dotenv').config({path:'./.env'})
import dotenv from "dotenv";
import  connectDB  from "./db/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
  path:"./env"
});

try {
  connectDB()
  .then((res)=>{
    app.listen(process.env.PORT || 6000,()=>{
      console.log(`server is running at ${process.env.PORT}`)
    })
  })
  .catch((error)=>{
      console.log("MONGODB CONNECTION ERR -----------",error);
  })
} catch (error) {
  console.log(`Error in index.js file`);
}