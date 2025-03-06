import { SignupPayload, SigninPayload } from "@/types/user";

// start ------------------------------ signup ------------------------------
export const signup = async (signupPayload: SignupPayload) => {
  try {
    const { role, confirmPassword, ...signupPayloadWithoutRole } =
      signupPayload;
    console.log(signupPayloadWithoutRole);
    const signupUri =
      role === "initiator"
        ? `${import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signup`
        : `${import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signup`;
    console.log(signupUri);
    const signupResponse = await fetch(signupUri, {
      method: "POST",
      body: JSON.stringify(signupPayloadWithoutRole),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      credentials: "include",
      mode: "cors",
    });

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
    const { role, ...signinPayloadWithoutRole } = signinPayload;
    const signinUri =
      role === "initiator"
        ? `${import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signin`
        : `${import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signin`;
    const signinResponse = await fetch(signinUri, {
      method: "POST",
      body: JSON.stringify(signinPayloadWithoutRole),
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
// start ------------------------------ logout ------------------------------
export const logout = async (role: string) => {
  const logoutUri =
    role === "initiator"
      ? `${import.meta.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signout`
      : `${import.meta.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signout`;
  const logoutResponse = await fetch(logoutUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_APP_API_KEY,
    },
    credentials: "include",
    mode: "cors",
  });
  return logoutResponse;
};
// end ------------------------------ logout ------------------------------
