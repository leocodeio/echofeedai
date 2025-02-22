import {
  participantLoginSchema,
  participantSignupSchema,
} from "../types/index";
import client from "../db/client";
import { compare, hash } from "../utils/crypt/mycrypt";
import { Request, Response } from "express";
import { createCookie } from "../utils/cookie/createCookie";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/token/createToken";
import { destroyCookie } from "../utils/cookie/destroyCookie";

export const participantSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signupData = participantSignupSchema.safeParse(req.body);
    if (!signupData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: signupData.error.errors,
        },
      });
      return;
    }

    const { email, password, name, sourceId } = signupData.data;
    const user = await client.participant.findFirst({
      where: { OR: [{ email }] },
    });

    if (user) {
      res.status(409).json({
        message: "An account with this email or username already exists",
        payload: {
          details: "Email or username already exists",
        },
      });
      return;
    }

    const hashedPassword = await hash(password);
    const newUser = await client.participant.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        sourceId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      payload: { user: newUser },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during signup",
      payload: {
        details: "Internal server error",
      },
    });
  }
};

export const participantSignin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loginData = participantLoginSchema.safeParse(req.body);
    if (!loginData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: loginData.error.errors,
        },
      });
      return;
    }

    const { email, password } = loginData.data;
    const user = await client.participant.findFirst({
      where: { email },
    });
    console.log("debug log 1: user", user);
    if (!user) {
      res.status(404).json({
        error: "Invalid credentials",
        payload: {
          details: "No user found with the provided email",
        },
      });
      return;
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: "Invalid credentials",
        payload: {
          details: "The provided password is incorrect",
        },
      });
      return;
    }

    const accessToken = createAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = createRefreshToken({
      id: user.id,
      email: user.email,
    });

    createCookie(req, res, accessToken, refreshToken, {
      message: "Signin successful",

      payload: {},
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during login",
      payload: {
        details: "Internal server error",
      },
    });
  }
};

export const participantSignout = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("debug log 1: signout");
  destroyCookie(req, res, {
    message: "Signout successful",
    payload: {},
  });
};

export const getParticipantProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await client.participant.findUnique({
      where: { id: userId },
    });

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: {
        user: user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
  }
};
