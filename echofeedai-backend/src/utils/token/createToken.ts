import jwt from "jsonwebtoken";
import { TokenPayload } from "../../types";

export const createAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export const createRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

