import { Request, Response } from "express";
import { ResponseData } from "../../types";

export const createCookie = (
  req: Request,
  res: Response,
  accessToken: string,
  refreshToken: string,
  responseData: ResponseData
): void => {
  res
    .status(200)
    .cookie("access-token", accessToken, {
      httpOnly: false, // Change to false so JavaScript can access it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    })
    .cookie("refresh-token", refreshToken, {
      httpOnly: false, // Change to false so JavaScript can access it

      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
    })


    .json(responseData);
};
