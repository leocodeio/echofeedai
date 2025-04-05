import { signupPayloadSchema } from "@/services/schemas/signup.schema";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";
import { z } from "zod";

export type User = {
  id: string;
  email: string;
  role: string;
};

export type SignupPayload = z.infer<typeof signupPayloadSchema>;
export type SigninPayload = z.infer<typeof signinPayloadSchema>;
