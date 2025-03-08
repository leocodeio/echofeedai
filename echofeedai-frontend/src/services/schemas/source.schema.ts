import { z } from "zod";

export const sourcePayloadSchema = z.object({
  companyName: z.string().min(1),
});
