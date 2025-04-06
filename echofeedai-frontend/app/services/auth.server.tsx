import { SignupPayload, SigninPayload } from "@/types/user";

// start ------------------------------ signup ------------------------------
export const signup = async (signupPayload: SignupPayload) => {
  try {
    const { role, confirmPassword, ...signupPayloadWithoutRole } =
      signupPayload;
    console.log(signupPayloadWithoutRole);
    const signupUri =
      role === "initiator"
        ? `${process.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signup`
        : `${process.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signup`;
    console.log(signupUri);
    const signupResponse = await fetch(signupUri, {
      method: "POST",
      body: JSON.stringify(signupPayloadWithoutRole),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_APP_API_KEY!,
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
        ? `${process.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signin`
        : `${process.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signin`;
    const signinResponse = await fetch(signinUri, {
      method: "POST",
      body: JSON.stringify(signinPayloadWithoutRole),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_APP_API_KEY!,
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
export const logout = async (
  role: string,
  accessToken: string,
  refreshToken: string
) => {
  const logoutUri =
    role === "initiator"
      ? `${process.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/signout`
      : `${process.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/signout`;
  const logoutResponse = await fetch(logoutUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.VITE_APP_API_KEY!,
      Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
    },
    credentials: "include",
    mode: "cors",
  });
  return logoutResponse;
};
// end ------------------------------ logout ------------------------------
// start ------------------------------ me ------------------------------
export const me = async (role: string) => {
  const meUri =
    role === "initiator"
      ? `${process.env.VITE_APP_INITIATOR_BACKEND_USER_URL}/me`
      : `${process.env.VITE_APP_PARTICIPANT_BACKEND_USER_URL}/me`;
  const meResponse = await fetch(meUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.VITE_APP_API_KEY!,
    },
    credentials: "include",
    mode: "cors",
  });
  return meResponse;
};
// end ------------------------------ me ------------------------------
