const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, customName, folder="BILL APP") => {
  try {
    if (!localFilePath) return null;
    const options = {
      folder: folder,
      resource_type: "auto"
    };
    if (customName) {
      options.public_id = customName;
    }
    const response = await cloudinary.uploader.upload(localFilePath, options);


    // File has been uploaded successfully
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }
    return response;
  } catch (error) {
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      // Ignore if file doesn't exist
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

module.exports = uploadOnCloudinary;