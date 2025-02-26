import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/token/validateToken";
import client from "../db/client";
declare global {
  namespace Express {
    export interface Request {
      id?: string;
      type?: string;
      email?: string;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { "access-token": accessToken, "refresh-token": refreshToken } =
    req.cookies;
  // console.log(Authorization);
  if (!accessToken) {
    res.status(401).json({
      message: "You are not signed in",
    });
    return;
  }

  const decoded = validateToken(accessToken);
  req.id = decoded.id;
  req.type = decoded.type;
  req.email = decoded.email;
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

export const isInitiator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, type } = req;
  if (type !== "initiator") {
    res.status(403).json({
      message: "Forbidden!! Only initiators can do this",
    });
    return;
  }

  const initiator = await client.initiator.findUnique({
    where: { id },
  });

  if (!initiator) {
    res.status(404).json({ message: "Initiator not found" });
    return;
  }
  next();
};
