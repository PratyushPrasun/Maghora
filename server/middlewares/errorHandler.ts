import type {
  ErrorRequestHandler,
} from "express";

import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  const statusCode =
    error instanceof ApiError
      ? error.statusCode
      : typeof (error as any)?.statusCode === "number"
      ? (error as any).statusCode
      : 500;

  const message =
    error instanceof ApiError || (error as any)?.statusCode
      ? error.message
      : "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};