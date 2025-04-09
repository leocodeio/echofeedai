import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { ActionResult } from "@/types/action-result";
import { addFeedbackResponse } from "@/services/source.server";
import { userSession } from "@/services/sessions.server";
import { getCoverage } from "~/services/model.server";
export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  const formData = await request.formData();
  // query params to get feedback initiate id
  const feedbackInitiateId = new URL(request.url).searchParams.get(
    "feedbackInitiateId"
  );
  if (!feedbackInitiateId) {
    return redirect("/home");
  }
  const feedback = formData.get("feedback") as string;
  const questionsByTopic = formData.get("questionsByTopic") as string;
  // Get questions from session storage
  // const storedQuestions = sessionStorage.getItem("generatedQuestions");
  // if (!storedQuestions) {
  //   return {
  //     success: false,
  //     message: "No questions found",
  //     data: null,
  //     origin: "respond",
  //   };
  // }
  console.log("questionsByTopic in action", questionsByTopic);
  const storedQuestions = questionsByTopic;
  const questions = JSON.parse(storedQuestions);
  // [TODO] - add questions to the database
  // Call your backend API to process feedback and get coverage
  const getCoverageResponse = await getCoverage(request, questions, feedback);
  if (!getCoverageResponse.ok) {
    return {
      success: false,
      message: "Failed to process feedback",
      data: null,
      origin: "respond",
    };
  }

  const coverageData = await getCoverageResponse.json();
  console.log("coverageData", coverageData.payload);

  if (coverageData.payload.all_topics_covered) {
    // make a call to save the feedback in database
    const saveFeedbackResponse = await addFeedbackResponse(
      feedbackInitiateId,
      feedback,
      request
    );
    if (!saveFeedbackResponse.ok) {
      return {
        success: false,
        message: "Failed to save feedback",
        data: null,
        origin: "respond",
      };
    }
    const saveFeedbackResponseData = await saveFeedbackResponse.json();
    console.log("saveFeedbackResponseData", saveFeedbackResponseData);
    return redirect("/thankyou");
  }
  return {
    success: true,
    message: "Feedback processed successfully",
    data: coverageData.payload,
  };
}
