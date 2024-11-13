// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";

// const router=Router();

// console.log("user route");

// router.route('/signup').post(registerUser);


// export default router;

import { Router } from "express";
import {loginUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"
const router = Router();

console.log("user route");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken)
export default router;