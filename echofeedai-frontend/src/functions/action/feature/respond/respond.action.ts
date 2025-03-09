import { ActionFunctionArgs, redirect } from "react-router-dom";
import { ActionResult } from "@/types/action-result";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  const feedback = formData.get("feedback") as string;

  // Get questions from session storage
  const storedQuestions = sessionStorage.getItem("generatedQuestions");
  if (!storedQuestions) {
    return {
      success: false,
      message: "No questions found",
      data: null,
      origin: "respond",
    };
  }

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

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to process feedback",
      data: null,
      origin: "respond",
    };
  }

  const coverageData = await response.json();
  console.log(coverageData.payload);

  if (coverageData.payload.all_topics_covered) {
    return redirect("/thankyou");
  }

  // Ensure we're returning the payload in a consistent format
  return {
    success: true,
    message: "Feedback processed successfully",
    data: {
      covered: coverageData.payload.covered.map((item: any) => ({
        topic: item.topic,
        question: item.question,
      })),
      not_covered: coverageData.payload.not_covered.map((item: any) => ({
        topic: item.topic,
        question: item.question,
      })),
    },
  };
}
