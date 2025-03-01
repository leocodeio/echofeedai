import {
  initiatorLoginSchema,
  initiatorSignupSchema,
  sourceSchema,
  sourceParticipantMapSchema,
  feedbackInitiateSchema,
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

export const updateSource = async (
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

    const updatedSource = await client.source.update({
      where: { id: sourceId },
      data: { companyName },
    });

    res.status(200).json({
      message: "Source updated successfully",
      payload: updatedSource,
    });
  } catch (error) {
    console.error("Update source error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during update source",
    });
  }
};

export const deleteSource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sourceId = req.params.id;
    if (!sourceId) {
      res.status(401).json({
        message: "Unauthorized: No source ID found",
      });
      return;
    }

    const source = await client.source.findUnique({
      where: { id: sourceId },
      include: {
        feedbackInitiates: true,
        SourceParticipantMap: true,
      },
    });

    if (!source) {
      res.status(404).json({
        message: "Source not found",
      });
      return;
    }

    await client.source.delete({
      where: { id: sourceId },
    });

    res.status(200).json({
      message: "Source deleted successfully",
    });
  } catch (error) {
    console.error("Delete source error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during delete source",
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

export const addParticipant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addParticipantData = sourceParticipantMapSchema.safeParse(req.body);
    if (!addParticipantData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: addParticipantData.error.errors,
        },
      });
      return;
    }

    const { sourceId, participantId } = addParticipantData.data;

    const source = await client.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      res.status(404).json({
        message: "Source not found",
      });
      return;
    }

    const participant = await client.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      res.status(404).json({
        message: "Participant not found",
      });
      return;
    }

    const sourceParticipantMap = await client.sourceParticipantMap.create({
      data: {
        sourceId,
        participantId,
      },
    });

    res.status(201).json({
      message: "Participant added successfully",
      payload: { sourceParticipantMap },
    });
  } catch (error) {
    console.error("Add participant error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during add participant",
    });
  }
};

export const initiateFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const initiateFeedbackData = feedbackInitiateSchema.safeParse(req.body);
    if (!initiateFeedbackData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: initiateFeedbackData.error.errors,
        },
      });
      return;
    }

    const { sourceId, mailTemplateIdentifier } = initiateFeedbackData.data;

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

    // get all participants for the source
    const sourceParticipantMap = await client.sourceParticipantMap.findMany({
      where: {
        sourceId,
      },
      select: {
        participant: {
          select: {
            email: true,
          },
        },
      },
    });

    const feedback = await client.feedbackInitiate.create({
      data: {
        sourceId,
        mailTemplateIdentifier,
        initiatorId: source.initiatorId,
        participantMails: sourceParticipantMap.map(
          (map) => map.participant.email
        ),
        feedbackResponseIds: [],
      },
    });
    console.log("debug log 1: feedback initiated", feedback);
    res.status(201).json({
      message: "Feedback initiated successfully",
      payload: feedback,
    });
    return;
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
