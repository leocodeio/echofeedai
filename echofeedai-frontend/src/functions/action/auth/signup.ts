import { type ActionFunctionArgs } from "react-router-dom";
import { signup } from "@/services/auth.server";
import { SignupPayload } from "@/types/user";
import { getUserSession } from "@/services/sessions.server";
import { ActionResultError, ActionResultSuccess } from "@/types/action-result";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signupPayload = {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  } as SignupPayload;

  const signupResult = await signup(signupPayload);
  if (signupResult instanceof Error) {
    const result: ActionResultError<SignupPayload> = {
      success: false,
      origin: "email",
      message: signupResult.message,
      data: signupPayload,
    };
    return Response.json(result, { status: 400 });
  }

  const session = getUserSession();
  session.setUser(signupResult.user);

  const result: ActionResultSuccess<SignupPayload> = {
    success: true,
    message: "Signup successful",
    data: signupPayload,
  };
  return Response.json(result);
}
