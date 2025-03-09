import { ActionFunctionArgs, redirect } from "react-router-dom";
import { ActionResult } from "@/types/action-result";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
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

  // Call your backend API to process feedback and get coverage
  const response = await fetch(
    `${import.meta.env.VITE_APP_MODEL_BACKEND_USER_URL}/get-coverage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
      body: JSON.stringify({
        question_map: questions,
        employee_text: feedback,
      }),
      credentials: "include",
      mode: "cors",
    }
  );
  console.log("response", response);

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to process feedback",
      data: null,
      origin: "respond",
    };
  }

  const coverageData = await response.json();
  console.log("coverageData", coverageData.payload);

  if (coverageData.payload.all_topics_covered) {
    // make a call to save the feedback in database
    return redirect("/thankyou");
  }
  return {
    success: true,
    message: "Feedback processed successfully",
    data: coverageData.payload,
  };
}
