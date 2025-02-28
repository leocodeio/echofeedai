import { NextFunction, Request, Response } from "express";

export const isAdminApikeyAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminKey = req.headers["x-admin-key"];
  const adminKeyAccepted = adminKey === process.env.ADMIN_KEY;
  if (!adminKeyAccepted) {
    res.status(403).json({
      message: "You are not an admin to do this",
    });
    return;
  }
  next();
};
