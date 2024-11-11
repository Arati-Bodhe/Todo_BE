import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
       //required: true
    },
    refreshToken: {
        type: String
    }

}, {
    timestamps: true
});

//middleware save before storing data to db
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = 10;
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    };
    return next();
});
//method for password validation
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}
//generate access token
userSchema.methods.generateAccessToken = async function(id){
    const payload = {
        _id: this._id,
        fullName: this.fullName,
        email: this.email
    }
    const user = await jwt.sign(
        payload
        , process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return user;
}
//generate refresh token
userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

}

const User = model("User", userSchema);
export {User};