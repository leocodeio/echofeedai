import { signupPayloadSchema } from "@/services/schemas/signup.schema";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";
import { SignupPayload, SigninPayload } from "@/types/user";
import { ActionResultError, ActionResultSuccess } from "@/types/action-result";

// start ------------------------------ signup ------------------------------
export const signup = async (signupPayload: SignupPayload) => {
  try {
    const signupUri = `${import.meta.env.VITE_APP_USER_BACKEND_USER_URL}/signup`;
    console.log(signupUri);
    const signupResponse = await fetch(signupUri, {
      method: "POST",
      body: JSON.stringify(signupPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
    });
    console.log(signupResponse);

    return signupResponse;
  } catch (error) {
    console.error("Auth signup error - auth.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ signup ------------------------------
// start ------------------------------ signin ------------------------------

export const signin = async (signinPayload: SigninPayload) => {
  try {
    const signinUri = `${import.meta.env.VITE_APP_USER_BACKEND_USER_URL}/signin`;
    const signinResponse = await fetch(signinUri, {
      method: "POST",
      body: JSON.stringify(signinPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });
    return signinResponse;
  } catch (error) {
    console.error("Auth signin error - auth.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ signin ------------------------------
