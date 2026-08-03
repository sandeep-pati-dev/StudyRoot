import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary config
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

// Stream upload function for unsigned preset
export const streamUpload = (buffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studyroot", // ✅ Target folder
        upload_preset: "studyroot_public", // ✅ Unsigned preset
        resource_type: "raw", // ✅ For PDF, DOCX, etc.
        use_filename: false, // ✅ Use original file name
        unique_filename: true, // ✅ Add random suffix to avoid collisions
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Upload profile picture from buffer
export const uploadProfileImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-pictures",
        resource_type: "image",
        access_mode: "public",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default connectCloudinary;
