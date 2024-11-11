import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(204, "user not found");
  };
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
  console.log("refresh and acces token", refreshToken, " and ", accessToken);
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}

const registerUser = asynHandler(async (req, res) => {
  //destructure the response
  //check if all required fields are there else throw an error
  //find the user  in db if present throw an error
  //
  //create user
  //if user created thenn send response (refreshtoke,accesstoken)
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    throw new ApiError(406, "All fields are required")
  };
  const findUser = await User.findOne({ email: req.body.email });
  console.log("finduser", req.body.email, findUser)
  if (findUser) {
    throw new ApiError(409, "user already exist")
  };
  const user = await User.create({
    email: email,
    fullName: fullName,
    password: password
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user")
  };
  return res.status(201).json(new ApiResponse(200, createdUser, "User register successfully"))
});

const loginUser = asynHandler(async (req, res) => {
  //check for the req body
  //check if password is correct
  //find the user in db
  //genrate access and refreshtoken

  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(406, "All fields are required")
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(404, "User not found")
  }
  const passwordCorrect = user.isPasswordCorrect(password);
  console.log("passwordCorrect ", passwordCorrect);

  if (!passwordCorrect) {
    throw new ApiError(401, "Invalid Credential")
  }
  const { accessToken, refreshToken } = await generateToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true
  }
  res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, loggedInUser, "login success")
    )
})


export { registerUser, loginUser }