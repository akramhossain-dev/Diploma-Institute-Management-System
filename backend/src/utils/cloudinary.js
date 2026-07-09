import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import logger from "./logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a raw file buffer directly to Cloudinary using streams.
 * Avoids writing temporary files to the disk.
 *
 * @param {Buffer} buffer    - The file buffer (from Multer memoryStorage)
 * @param {string} folder    - Target folder name in Cloudinary (e.g. "dims_uploads")
 * @returns {Promise<object>} - Resolves with { url, publicId }
 */
export const uploadBuffer = (buffer, folder = "dims_uploads") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // Automatically detect PDF, PNG, JPG, CSV, etc.
      },
      (error, result) => {
        if (error) {
          logger.error(`[Cloudinary] Upload failed: ${error.message}`);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete a file asset from Cloudinary using its public ID.
 *
 * @param {string} publicId  - Cloudinary asset public ID
 * @returns {Promise<object>}
 */
export const deleteAsset = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        logger.error(`[Cloudinary] Delete failed for publicId ${publicId}: ${error.message}`);
        return reject(error);
      }
      resolve(result);
    });
  });
};

export default { uploadBuffer, deleteAsset };
