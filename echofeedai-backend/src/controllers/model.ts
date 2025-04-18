import { Request, Response } from "express";
import client from "../db/client";
import {
  TopicToQuestionMap,
  CoverageResult,
  topicsSchema,
  coverageSchema,
} from "../types";
import axios from "axios";

export const generateQuestions = async (req: Request, res: Response) => {
  try {
    console.log("generate questions called");
    const topicRequestData = topicsSchema.safeParse(req.body);
    if (!topicRequestData.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: topicRequestData.error.errors,
        },
      });
      return;
    }

    // Call the python model here, and get the response
    const pythonModelApi = process.env.BACKEND_PYTHON_MODEL_API;
    const response = await axios.post(`${pythonModelApi}/generate-questions`, {
      topics: topicRequestData.data.topics,
    });
    if (response.status !== 200) {
      res.status(500).json({
        message: "Failed to generate questions",
        payload: {},
      });
      return;
    }
    // console.log("response", response.data.question_map);
    const { question_map } = response.data as TopicToQuestionMap;
    // console.log("topics", question_map);

    res.status(200).json({
      message: "Questions generated successfully",
      payload: {
        question_map,
      },
    });
    return;
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({
      message: "Failed to generate questions model is not responding",
      payload: {},
    });
    return;
  }
};

export const getQuestionsFromTopics = async (topics: string[]) => {
  const pythonModelApi = process.env.BACKEND_PYTHON_MODEL_API;
  const response = await axios.post(`${pythonModelApi}/generate-questions`, {
    topics,
  });
  // console.log("response", response.data.question_map);
  const { question_map } = response.data as TopicToQuestionMap;
  // console.log("topics", question_map);

  return Object.values(question_map);
};

export const getCoverage = async (req: Request, res: Response) => {
  try {
    console.log("get coverage called");
    const coverageRequest = coverageSchema.safeParse(req.body);
    if (!coverageRequest.success) {
      res.status(400).json({
        message: "Validation failed",
        payload: {
          details: coverageRequest.error.errors,
        },
      });
      return;
    }

    // Call the python model here, and get the response
    const pythonModelApi = process.env.BACKEND_PYTHON_MODEL_API;
    const response = await axios.post(`${pythonModelApi}/process-feedback`, {
      question_map: coverageRequest.data.question_map,
      employee_text: coverageRequest.data.employee_text,
    });
    const { all_topics_covered, covered, not_covered } =
      response.data as CoverageResult;

    res.status(200).json({
      message: "Coverage fetched successfully",
      payload: {
        all_topics_covered,
        covered,
        not_covered,
      },
    });
    return;
  } catch (error) {
    console.error("Error getting coverage:", error);
    res.status(500).json({
      message: "Failed to get coverage model is not responding",
      payload: {},
    });
  }
};
