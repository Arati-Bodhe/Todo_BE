import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, (res) => {
        console.log(`application listening at PORT ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(`db connection failed`);

})
