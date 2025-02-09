import { z } from "zod";

export const topicsPayloadSchema = z.object({
  topics: z.array(z.string()),
});

