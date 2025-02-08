import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/token/validateToken";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export const  isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { "access-token": accessToken, "refresh-token": refreshToken } = req.cookies;
  // console.log(Authorization);
  if (!accessToken) {
    res.status(401).json({

      message: "You are not signed in",
    });
    return;
  }

  const decoded = validateToken(accessToken);
  req.userId = decoded.id;
  next();
};

export const isApikeyAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const apiKeyAccepted = apiKey === process.env.X_API_KEY;
  if (!apiKeyAccepted) {
    res.status(403).json({
      message: "You are not authorized to do this",
    });
    return;
  }
  next();
};
