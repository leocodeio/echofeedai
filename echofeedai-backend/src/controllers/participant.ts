import {
  participantLoginSchema,
  participantSignupSchema,
  feedbackResponseSchema,
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
import axios from "axios";

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
      payload: newParticipant,
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
      role: participant.role as "participant",
    });
    const refreshToken = createRefreshToken({
      id: participant.id,
      email: participant.email,
      role: participant.role as "participant",
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

    if (!participant) {
      res.status(404).json({
        message: "Participant not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: participant,
    });
  } catch (error) {
    console.error("Get profile error:", error);
  }
};

export const participantFeedbackResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const participantId = req.id;
    if (!participantId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    const feedbackResponseData = feedbackResponseSchema.safeParse(req.body);
    if (!feedbackResponseData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: feedbackResponseData.error.errors,
        },
      });
      return;
    }

    const { feedbackInitiateId, response } = feedbackResponseData.data;

    const feedbackInitiate = await client.feedbackInitiate.findUnique({
      where: { id: feedbackInitiateId },
    });

    if (!feedbackInitiate) {
      res.status(404).json({
        message:
          "You cannot respond to this feedback initiate as it is not existing",
      });
      return;
    }

    const particiantIds = feedbackInitiate.participantIds;

    if (!particiantIds.includes(participantId)) {
      res.status(404).json({
        message: "You are not a participant of this feedback initiate",
      });
      return;
    }

    const feedbackResponse = await client.feedbackResponse.create({
      data: { participantId, feedbackInitiateId, response },
    });

    res.status(201).json({
      message: "Feedback response created successfully",
      payload: {
        feedbackResponse,
      },
    });
  } catch (error) {
    console.error("Feedback response error:", error);
  }
};

export const getParticipantByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.params;
    const participant = await client.participant.findFirst({
      where: { name },
    });
    if (!participant) {
      res.status(404).json({
        message: "Participant not found",
      });
      return;
    }
    res.status(200).json({
      message: "Participant fetched successfully",
      payload: participant,
    });
  } catch (error) {
    console.error("Get participant by name error:", error);
  }
};

export const getParticipantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const participant = await client.participant.findUnique({
      where: { id },
      select: {
        email: true,
      },
    });
    if (!participant) {
      res.status(404).json({
        message: "Participant not found",
      });
      return;
    }
    res.status(200).json({
      message: "Participant fetched successfully",
      payload: participant,
    });
  } catch (error) {
    console.error("Get participant by id error:", error);
  }
};

export const addFeedbackResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const participantId = req.id;
    if (!participantId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const feedbackInitiateId = req.params.feedbackInitiateId;
    if (!feedbackInitiateId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const feedbackInitiate = await client.feedbackInitiate.findUnique({
      where: { id: feedbackInitiateId },
    });

    if (!feedbackInitiate) {
      res.status(404).json({
        message: "Feedback initiate not found",
      });
      return;
    }

    const particiantIds = feedbackInitiate.participantIds;

    if (!particiantIds.includes(participantId)) {
      res.status(404).json({
        message: "You are not a participant of this feedback initiate",
      });
      return;
    }

    // [TODO] safeparse?
    const { response } = req.body;
    // make call to model to get responseScoreMap
    const questionMap: { [key: string]: string } = {};
    for (let i = 0; i < feedbackInitiate.questions?.length; i++) {
      if (feedbackInitiate.questions[i]) {
        questionMap[feedbackInitiate.topics[i]] = feedbackInitiate.questions[i];
      }
    }

    console.log("debug log 1: questionMap", questionMap);
    console.log("debug log 2: response", response);
    let responseScoreMap = {};
    try {
      const responseScoreMapResponse = await axios.post(
        `${process.env.BACKEND_PYTHON_MODEL_API}/get-score-map/`,
        {
          question_map: questionMap,
          employee_text: response,
        }
      );
      responseScoreMap = responseScoreMapResponse.data.score_map;
    } catch (error) {
      console.error("Get score map error at python model:", error);
    }

    const feedbackResponse = await client.feedbackResponse.create({
      data: { participantId, feedbackInitiateId, responseScoreMap, response },
    });

    res.status(201).json({
      message: "Feedback response created successfully",
      payload: {
        feedbackResponse,
      },
    });
  } catch (error) {
    console.error("Add feedback response error:", error);
  }
};

export const canRespond = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("canRespond");
    const participantId = req.id;
    console.log("participantId", participantId);
    if (!participantId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const feedbackInitiateId = req.params.feedbackInitiateId;
    console.log("feedbackInitiateId", feedbackInitiateId);
    if (!feedbackInitiateId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const feedbackInitiate = await client.feedbackInitiate.findUnique({
      where: { id: feedbackInitiateId },
    });

    if (!feedbackInitiate) {
      res.status(404).json({
        message: "Feedback initiate not found",
      });
      return;
    }

    const particiantIds = feedbackInitiate.participantIds;

    if (!particiantIds.includes(participantId)) {
      res.status(404).json({
        message: "You are not a participant of this feedback initiate",
      });
      return;
    }

    const feedbackResponses = await client.feedbackResponse.findMany({
      where: {
        feedbackInitiateId: feedbackInitiateId,
        participantId: participantId,
      },
    });
    console.log("feedbackResponses", feedbackResponses);

    if (feedbackResponses.length > 0) {
      res.status(404).json({
        message: "You have already responded to this feedback initiate",
      });
      return;
    }
    res.status(200).json({
      message: "You can respond to this feedback initiate",
      payload: {},
    });
  } catch (error) {
    console.error("Can respond error:", error);
  }
};
