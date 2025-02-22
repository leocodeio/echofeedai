import { Request, Response } from "express";

export const destroyCookie = (
  req: Request,
  res: Response,
  responseData: any
): void => {
  res
    .status(200)
    .clearCookie("access-token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    })
    .clearCookie("refresh-token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    })
    .json(responseData);
};
