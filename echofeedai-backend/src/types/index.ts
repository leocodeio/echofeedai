import z from "zod";

export const initiatorSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const initiatorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const initiatorLogoutSchema = z.object({
  token: z.string(),
});

export const initiatorProfileSchema = z.object({
  token: z.string(),
});

export const participantSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  sourceId: z.string(),
});

export const participantLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const participantLogoutSchema = z.object({
  token: z.string(),
});

export const participantProfileSchema = z.object({
  token: z.string(),
});

export const topicsSchema = z.object({
  topics: z.array(z.string()),
});

export const coverageSchema = z.object({
  employee_text: z.string(),
  question_map: z.record(z.string(), z.string()),
});

export type User = {
  id: string;
  username: string;
};

export type TokenPayload = {
  id: string;
  email: string;
};

export type TopicToQuestionMap = Record<string, string>;

export type CoverageResult = {
  all_topics_covered: boolean;
  covered: Record<string, string>[];
  not_covered: Record<string, string>[];
};
