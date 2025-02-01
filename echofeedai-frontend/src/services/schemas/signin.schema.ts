import { z } from "zod";

export const signinPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

