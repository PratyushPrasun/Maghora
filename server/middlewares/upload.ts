import multer from "multer";
import type { RequestHandler } from "express";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        Object.assign(
          new Error("Only JPG, PNG and WebP images are allowed"),
          { statusCode: 400 }
        )
      );
      return;
    }

    callback(null, true);
  },
});

export const uploadProductImagesMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  upload.array("images", 8)(req, res, (error) => {
    if (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Image upload failed",
      });
      return;
    }

    next();
  });
};