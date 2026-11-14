
import type { IUser } from "../modules/users/user.model.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    authVersion?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser;
      rawBody?: Buffer;
    }
  }
}

export {};
