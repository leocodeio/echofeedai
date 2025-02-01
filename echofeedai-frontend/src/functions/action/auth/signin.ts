import { type ActionFunctionArgs } from "react-router-dom";
import { signin } from "@/services/auth.server";
import { SigninPayload } from "@/types/user";
import { getUserSession } from "@/services/sessions.server";
import { ActionResultError, ActionResultSuccess } from "@/types/action-result";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signinPayload = {
    email: data.email,
    password: data.password,
  } as SigninPayload;

  const signinResult = await signin(signinPayload);
  if (!signinResult) {
    const result: ActionResultError<SigninPayload> = {
      success: false,
      origin: "password",
      message: "Invalid email or password",
      data: signinPayload,
    };
    return Response.json(result, { status: 400 });
  }

  const session = getUserSession();
  session.setUser(signinResult.user);

  const result: ActionResultSuccess<SigninPayload> = {
    success: true,
    message: "Signin successful",
    data: signinPayload,
  };
  return Response.json(result);
}
