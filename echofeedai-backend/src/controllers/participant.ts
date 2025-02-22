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

    const { email, password, name } = signupData.data;
    const participant = await client.participant.findFirst({
      where: { OR: [{ email }] },
    });

    if (participant) {
      res.status(409).json({
        message: "An account with this email already exists",
        payload: {
          details: "Email already exists",
        },
      });
      return;
    }

    const hashedPassword = await hash(password);
    const newParticipant = await client.participant.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });

    res.status(201).json({
      message: "Participant created successfully",
      payload: { participant: newParticipant },
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
    const participant = await client.participant.findFirst({
      where: { email },
    });
    console.log("debug log 1: participant", participant);
    if (!participant) {
      res.status(404).json({
        error: "Invalid credentials",
        payload: {
          details: "No participant found with the provided email",
        },
      });
      return;
    }

    const isPasswordValid = await compare(password, participant.passwordHash);
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
      id: participant.id,
      email: participant.email,
      type: "participant",
    });
    const refreshToken = createRefreshToken({
      id: participant.id,
      email: participant.email,
      type: "participant",
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
    const participantId = req.id;
    const participant = await client.participant.findUnique({
      where: { id: participantId },
    });

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: {
        participant: participant,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
  }
};
