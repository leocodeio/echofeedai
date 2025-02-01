import { type ActionFunctionArgs } from "react-router-dom";
import { signup } from "@/services/auth.server";
import { SignupPayload } from "@/types/user";
import { userSession } from "@/services/sessions.server";

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
    return Response.json(
      { success: false, errors: { email: [signupResult.message] } },
      { status: 400 }
    );
  }
  console.log(signupResult);
  const session = await userSession(request);
  session.setUserSession(signupResult.user);
  console.log(session.getUserSession());
  return Response.json(
    { success: true, user: signupResult.user },
    {
      headers: {
        "Set-Cookie": await session.commitUserSession(),
      },
    }
  );
}
