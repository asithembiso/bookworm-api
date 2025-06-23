import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";

/**
 * Configures the Cloudinary library with credentials from environment variables.
 * Used for uploading and managing images.
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;