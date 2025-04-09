import { TopicsPayload } from "@/types/topic";
import { userSession } from "./sessions.server";

// start ------------------------------ generate ------------------------------
export const generate = async (
  topicsPayload: TopicsPayload,
  request: Request
) => {
  try {
    const generateUri = `${process.env.VITE_APP_MODEL_BACKEND_USER_URL}/generate-questions`;
    console.log(generateUri);
    const session = await userSession(request);
    const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
    const generateResponse = await fetch(generateUri, {
      method: "POST",
      body: JSON.stringify(topicsPayload),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_APP_API_KEY!,
        Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
      },
      credentials: "include",
      mode: "cors",
    });
    console.log(generateResponse);

    return generateResponse;
  } catch (error) {
    console.error("Auth generate error - model.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ generate ------------------------------
// start ------------------------------ getCoverage ------------------------------
export const getCoverage = async (request: Request, questions: string[], feedback: string) => {
  try {
    const getCoverageUri = `${process.env.VITE_APP_MODEL_BACKEND_USER_URL}/get-coverage`;
    const session = await userSession(request);
    const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
    const getCoverageResponse = await fetch(getCoverageUri, {
      method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.VITE_APP_API_KEY!,
      Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
    },
    body: JSON.stringify({
      question_map: questions,
      employee_text: feedback,
    }),
      credentials: "include",
      mode: "cors",
    });
    console.log("response", getCoverageResponse);
    return getCoverageResponse;
  } catch (error) {
    console.error("Auth generate error - model.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ getCoverage ------------------------------
