import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_aPI_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return `could not find the localfile path`
        };
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("uploadResult", uploadResult);
        return uploadResult;
    } catch (error) {
        console.log(`error in file upload`, error);
        return null;
    }
};
export {uploadOnCloudinary};