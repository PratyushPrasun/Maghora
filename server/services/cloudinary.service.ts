import cloudinary, {
  isCloudinaryConfigured,
} from "../config/cloudinary.js";

export interface UploadedImage {
  publicId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export const uploadProductImage = async (
  file: Express.Multer.File,
  index: number
): Promise<UploadedImage> => {
  if (!isCloudinaryConfigured()) {
    throw Object.assign(
      new Error("Cloudinary is not configured"),
      { statusCode: 503 }
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "maghora/products",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          {
            width: 1600,
            height: 1600,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ?? new Error("Cloudinary image upload failed")
          );
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          alt: "",
          isPrimary: index === 0,
          sortOrder: index,
        });
      }
    );

    stream.end(file.buffer);
  });
};

export const uploadProductImages = async (
  files: Express.Multer.File[]
): Promise<UploadedImage[]> => {
  const uploaded: UploadedImage[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const image = await uploadProductImage(file, index);
      uploaded.push(image);
    }

    return uploaded;
  } catch (error) {
    await deleteCloudinaryImages(
      uploaded.map((image) => image.publicId)
    );

    throw error;
  }
};

export const deleteCloudinaryImages = async (
  publicIds: string[]
): Promise<void> => {
  if (!publicIds.length) return;

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  await Promise.all(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      })
    )
  );
};