import {
  initiatorLoginSchema,
  initiatorSignupSchema,
  sourceSchema,
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

export const initiatorSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signupData = initiatorSignupSchema.safeParse(req.body);
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
    const initiator = await client.initiator.findFirst({
      where: { OR: [{ email }] },
    });

    if (initiator) {
      res.status(409).json({
        message: "An account with this email already exists",
        payload: {
          details: "Email already exists",
        },
      });
      return;
    }

    const hashedPassword = await hash(password);
    const newInitiator = await client.initiator.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Initiator created successfully",
      payload: { initiator: newInitiator },
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

export const initiatorSignin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loginData = initiatorLoginSchema.safeParse(req.body);
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
    const initiator = await client.initiator.findFirst({
      where: { email },
    });
    if (!initiator) {
      res.status(404).json({
        error: "Invalid credentials",
        payload: {
          details: "No initiator found with the provided email",
        },
      });
      return;
    }

    const isPasswordValid = await compare(password, initiator.passwordHash);
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
      id: initiator.id,
      email: initiator.email,
      type: "initiator",
    });
    const refreshToken = createRefreshToken({
      id: initiator.id,
      email: initiator.email,
      type: "initiator",
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

export const initiatorSignout = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("debug log 1: signout");
  destroyCookie(req, res, {
    message: "Signout successful",
    payload: {},
  });
};

export const getInitiatorProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const initiatorId = req.id;
    const initiator = await client.initiator.findUnique({
      where: { id: initiatorId },
    });

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: {
        initiator: initiator,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
  }
};

export const addSource = async (req: Request, res: Response): Promise<void> => {
  try {
    const initiatorId = req.id;
    if (!initiatorId) {
      res.status(401).json({
        message: "Unauthorized: No initiator ID found",
      });
      return;
    }

    const source = await client.source.findFirst({
      where: {
        companyName: req.body.companyName,
      },
    });

    if (source) {
      res.status(400).json({
        message: "Source already exists",
      });
      return;
    }

    const sourceData = sourceSchema.safeParse(req.body);

    if (!sourceData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: sourceData.error.errors,
        },
      });
      return;
    }

    const { companyName } = sourceData.data;

    const newSource = await client.source.create({
      data: {
        initiatorId,
        companyName,
      },
      select: {
        id: true,
        companyName: true,
      },
    });

    res.status(201).json({
      message: "Source added successfully",
      payload: newSource,
    });
  } catch (error) {
    console.error("Add source error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during add source",
      payload: {
        details: "Internal server error",
      },
    });
  }
};

export const getSources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const initiatorId = req.id;
    const sources = await client.source.findMany({
      where: {
        initiatorId,
      },
      select: {
        id: true,
        companyName: true,
      },
    });

    res.status(200).json({
      message: "Sources fetched successfully",
      payload: { sources },
    });
  } catch (error) {
    console.error("Get sources error:", error);
  }
};

export const getSourceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sourceId = req.params.id;

    const source = await client.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      res.status(404).json({
        message: "Source not found",
      });
      return;
    }

    res.status(200).json({
      message: "Source fetched successfully",
      payload: { source },
    });
  } catch (error) {
    console.error("Get source by id error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during get source by id",
      payload: {
        details: "Internal server error",
      },
    });
  }
};

export const initiateFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sourceId = req.params.sourceId;

    if (!sourceId) {
      res.status(401).json({
        message: "Unauthorized: No source ID found",
      });
      return;
    }

    const source = await client.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      res.status(404).json({
        message: "Source not found",
      });
      return;
    }

    const feedback = await client.feedbackInitiate.create({
      data: {
        sourceId,
        initiatorId: source.initiatorId,
        mailTemplateId: "clxk0000000000000000000000000000000",
        participantMails: ["test@test.com"],
        feedbackResponses: {
          create: [],
        },
      },
    });
  } catch (error) {
    console.error("Initiate feedback error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during initiate feedback",
      payload: {
        details: "Internal server error",
      },
    });
  }
};
