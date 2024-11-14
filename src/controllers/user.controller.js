import jwt from "jsonwebtoken";
import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found")
  };
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
 // console.log("refresh and acces token", refreshToken, " and ", accessToken);
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}

const registerUser = asynHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    res.status(400).json(new ApiError(406, "All fields are required"))
  };
  const findUser = await User.findOne({ email: req.body.email });
  // console.log("finduser", req.body.email, findUser)
  if (findUser) {
    res.status(401).json(new ApiError(401, "user already exist"))
  };
  const user = await User.create({
    email: email,
    fullName: fullName,
    password: password
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if (!createdUser) {
    res.status(500).json(ApiError(500, "something went wrong while registering user"))
  };
  return res.status(201).json(new ApiResponse(200, createdUser, "User register successfully"))
});

const loginUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(406).json(
      new ApiError(406,"all field required")
    )
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(406).json(
      new ApiError(406,"user not found")
    )  }
  const passwordCorrect =await user.isPasswordCorrect(password);
  console.log("passwordCorrect ", passwordCorrect);

  if (!passwordCorrect) {
    res.status(401).json(
      new ApiError(401,"Invalid credential")
    ) 
  }
  const { accessToken, refreshToken } = await generateToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  console.log("loggedInUser => ",loggedInUser);
  
  const options = {
    httpOnly: true,
    secure: true
  }
  // res.status(200).cookie("accessToken", accessToken, options)
  //   .cookie("refreshToken", refreshToken, options)
  //   .json(
  //     new ApiResponse(200, loggedInUser, "login success")
  //   )
  res.status(200).setHeader("Authorization", accessToken, options)
    .setHeader("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, loggedInUser, "login success")
    )
});

const refreshAccessToken = asynHandler(async (req, res) => {
  //get the token from the request header
  //if token is not present throw error
  //decode token
  //find user in db using id
  //update the refreshtoken 
  //send both token in response
  
  const refreshTokenFromReq = await req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshTokenFromReq) {
    throw new ApiError(404, "invalid refreshtoken")
  };
  const decodedRefreshToken = await jwt.verify(refreshTokenFromReq, process.env.REFRESH_TOKEN_SECRET);
  if (!decodedRefreshToken) {
    throw new ApiError(404, "invalid refreshtoken")
  }
  const user = await User.findById(decodedRefreshToken._id)
  if (!user) {
    throw new ApiError(404, "User not found")
  }
  console.log("user is",user);
  
  const { accessToken, refreshToken } = await generateToken(user._id);
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Internal Server Error");
  }
  const options = {
    httpOnly: true,
    secure: true
  };
  res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, [], "token refreshed")
    )

});


export { registerUser, loginUser, refreshAccessToken };