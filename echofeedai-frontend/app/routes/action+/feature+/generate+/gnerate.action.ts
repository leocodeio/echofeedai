import { ActionResult, ActionResultError } from "@/types/action-result";
import { topicsPayloadSchema } from "@/services/schemas/topics.schema";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { TopicsPayload } from "@/types/topic";
import { generate } from "@/services/model.server";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  const topics = formData.get("topics") as string;
  const separator = "#separator#";
  const topicsArray = topics.split(separator);
  const topicsPayload = {
    topics: topicsArray,
  };

  // parse with zod
  const parsedTopicsPayload = topicsPayloadSchema.safeParse(topicsPayload);
  if (!parsedTopicsPayload.success) {
    const result: ActionResultError<any> = {
      success: false,
      origin: "topics",
      message: parsedTopicsPayload.error.issues[0].message,
      data: parsedTopicsPayload.data,
    };
    return Response.json(result, { status: 400 });
  }

  const generateReponse = await generate(parsedTopicsPayload.data);
  if (!generateReponse.ok) {
    // 500
    const result: ActionResultError<TopicsPayload> = {
      success: false,
      origin: "topics",
      message: "Failed to generate",
      data: parsedTopicsPayload.data,
    };
    return Response.json(result, { status: 500 });
  }

  const generatedData = await generateReponse.json();
  //   const result: ActionResultSuccess<any> = {
  //     success: true,
  //     message: "Generate successfully",
  //     data: generatedData,
  //   };
  //   console.log(result);
  sessionStorage.setItem(
    "generatedQuestions",
    JSON.stringify(generatedData.payload.question_map)
  );
  return redirect("/feature/respond");
}
