import type { RequestHandler } from "express";

export const parseMultipartData: RequestHandler = (
  req,
  res,
  next
) => {
  try {
    if (typeof req.body?.data !== "string") {
      res.status(400).json({
        success: false,
        message: "A valid JSON data field is required",
      });

      return;
    }

    const parsed = JSON.parse(req.body.data);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      res.status(400).json({
        success: false,
        message: "The data field must contain a JSON object",
      });

      return;
    }

    req.body = parsed;

    next();
  } catch {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in multipart data field",
    });
  }
};