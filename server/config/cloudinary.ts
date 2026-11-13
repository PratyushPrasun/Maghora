import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

const credentials = {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
};

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    credentials.cloud_name &&
    credentials.api_key &&
    credentials.api_secret
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config(credentials);
}

export default cloudinary;