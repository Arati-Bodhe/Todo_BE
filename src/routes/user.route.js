// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";

// const router=Router();

// console.log("user route");

// router.route('/signup').post(registerUser);


// export default router;

import { Router } from "express";
import {loginUser, registerUser} from "../controllers/user.controller.js"
const router = Router();

console.log("user route");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
export default router;