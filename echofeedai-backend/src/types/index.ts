import z from "zod";

// initiator
// schemas
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

// participant
// schemas
export const participantSignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
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

// source
// schemas
export const sourceSchema = z.object({
  companyName: z.string(),
  participants: z.array(z.string()),
});

// mail template
// schemas
export const mailTemplateSchema = z.object({
  identifier: z.string(),
  subject: z.string(),
  variables: z.array(z.string()),
  body: z.string(),
});

export const sendMailSchema = z.object({
  templateName: z.string(),
  recipientEmail: z.string().email(),
  variableValues: z.record(z.string(), z.string()),
});

export const sendMailToParticipantsSchema = z.object({
  participantIds: z.array(z.string()),
  templateName: z.string(),
});

// token payload
export type TokenPayload = {
  id: string;
  email: string;
  type: "initiator" | "participant";
};

// python model
// schemas
export const topicsSchema = z.object({
  topics: z.array(z.string()),
});

export const coverageSchema = z.object({
  employee_text: z.string(),
  question_map: z.record(z.string(), z.string()),
});

// types
export type TopicToQuestionMap = Record<string, string>;

export type CoverageResult = {
  all_topics_covered: boolean;
  covered: Record<string, string>[];
  not_covered: Record<string, string>[];
};
