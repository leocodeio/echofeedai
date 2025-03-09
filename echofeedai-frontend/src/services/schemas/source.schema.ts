import { z } from "zod";

export const sourcePayloadSchema = z.object({
  companyName: z.string().min(1),
});

export const sendMailPayloadSchema = z.object({
  feedbackInitiateId: z.string().min(1),
});
