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
import { addSyntheticLeadingComment } from "typescript";

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
      payload: newInitiator,
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
      role: initiator.role as "initiator",
    });
    const refreshToken = createRefreshToken({
      id: initiator.id,
      email: initiator.email,
      role: initiator.role as "initiator",
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
    if (!initiator) {
      res.status(404).json({
        message: "Initiator not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: initiator,
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

    // First delete all related SourceParticipantMap entries
    await client.sourceParticipantMap.deleteMany({
      where: { sourceId },
    });

    // Then delete all related FeedbackInitiate entries
    await client.feedbackInitiate.deleteMany({
      where: { sourceId },
    });

    // Finally delete the source
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
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "Sources fetched successfully",
      payload: sources,
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
      payload: source,
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

    // check if the participant is already in the source
    const isParticipantInSource = await client.sourceParticipantMap.findFirst({
      where: {
        sourceId,
        participantId,
      },
    });

    if (isParticipantInSource) {
      res.status(400).json({
        message: "Participant already in the source",
      });
      return;
    }

    const sourceParticipantMap = await client.sourceParticipantMap.create({
      data: {
        sourceId,
        participantId,
      },
    });

    // add to all feedback initiates for the source
    const feedbackInitiates = await client.feedbackInitiate.findMany({
      where: {
        sourceId,
      },
    });

    for (const feedbackInitiate of feedbackInitiates) {
      await client.feedbackInitiate.update({
        where: { id: feedbackInitiate.id },
        data: {
          participantIds: [...feedbackInitiate.participantIds, participantId],
        },
      });
    }

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

    const { sourceId, mailTemplateIdentifier, topics } =
      initiateFeedbackData.data;

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
            id: true,
          },
        },
      },
    });

    const feedback = await client.feedbackInitiate.create({
      data: {
        sourceId,
        mailTemplateIdentifier,
        initiatorId: source.initiatorId,
        participantIds: sourceParticipantMap.map((map) => map.participant.id),
        feedbackResponseIds: [],
        topics,
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

export const deleteFeedbackInitiate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const feedbackInitiateId = req.params.id;
    if (!feedbackInitiateId) {
      res.status(401).json({
        message: "Unauthorized: No feedback initiate ID found",
      });
      return;
    }

    await client.feedbackInitiate.delete({
      where: { id: feedbackInitiateId },
    });

    res.status(200).json({
      message: "Feedback initiate deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback initiate error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during delete feedback initiate",
    });
  }
};

export const getFeedbackInitiates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sourceId = req.params.sourceId;
    if (!sourceId) {
      res.status(401).json({
        message: "source ID not found",
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

    const feedbackInitiates = await client.feedbackInitiate.findMany({
      where: {
        sourceId,
      },
      select: {
        id: true,
        mailTemplateIdentifier: true,
        participantIds: true,
        createdAt: true,
        topics: true,
      },
    });

    res.status(200).json({
      message: "Feedback initiates fetched successfully",
      payload: feedbackInitiates.map((feedbackInitiate) => ({
        ...feedbackInitiate,
        name: source.companyName,
      })),
    });
  } catch (error) {
    console.error("Get feedback initiates error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during get feedback initiates",
    });
  }
};

export const removeParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sourceId = req.params.sourceId;
    const participantId = req.params.participantId;

    if (!sourceId || !participantId) {
      res.status(401).json({
        message: "Unauthorized: No source ID or participant ID found",
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

    const sourceParticipantMap = await client.sourceParticipantMap.findFirst({
      where: {
        AND: [{ sourceId: sourceId }, { participantId: participantId }],
      },
    });

    if (!sourceParticipantMap) {
      res.status(404).json({
        message: "Participant not found in the source",
      });
      return;
    }

    await client.sourceParticipantMap.delete({
      where: {
        id: sourceParticipantMap.id,
      },
    });

    res.status(200).json({
      message: "Participant removed successfully",
    });
  } catch (error) {
    console.error("Remove participants error:", error);
  }
};

export const getParticipants = async (
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

    const participants = await client.sourceParticipantMap.findMany({
      where: {
        sourceId,
      },
    });
    const participantsWithDetails = await Promise.all(
      participants.map(async (participant) => {
        const participantData = await client.participant.findUnique({
          where: { id: participant.participantId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return participantData;
      })
    );

    res.status(200).json({
      message: "Participants fetched successfully",
      payload: participantsWithDetails,
    });
  } catch (error) {
    console.error("Get participants error:", error);
    res.status(500).json({
      message: "An unexpected error occurred during get participants",
    });
  }
};
