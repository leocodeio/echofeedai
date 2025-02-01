import { signupPayloadSchema } from "@/services/schemas/signup.schema";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";
import { SignupPayload, SigninPayload } from "@/types/user";

// start ------------------------------ signup ------------------------------
export const signup = async (signupPayload: SignupPayload) => {
  const { email, password, confirmPassword } = signupPayloadSchema.parse(
    signupPayload
  );

  if (password !== confirmPassword) {
    return new Error("password and confirm password do not match");
  }

  // signup to save user
  // create user in database
  // create session

  return {
    user: {
      id: "1",
      email,
      name: "John Doe",
    },
  };
};
// end ------------------------------ signup ------------------------------
// start ------------------------------ signin ------------------------------

export const signin = async (signinPayload: SigninPayload) => {
  const { email, password } = signinPayloadSchema.parse(signinPayload);
  // get user from storage

  return {
    user: {
      id: "1",
      email,
      name: "John Doe",
    },
  };
};
// end ------------------------------ signin ------------------------------
