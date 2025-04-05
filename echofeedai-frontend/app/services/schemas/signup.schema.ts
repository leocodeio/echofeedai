import { z } from "zod";

export const signupPayloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  role: z.enum(["initiator", "participant"]),
});

