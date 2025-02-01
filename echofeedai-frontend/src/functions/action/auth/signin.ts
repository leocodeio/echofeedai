import { type ActionFunctionArgs } from "react-router-dom";
import { signin } from "@/services/auth.server";
import { SigninPayload } from "@/types/user";
import { userSession } from "@/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signinPayload = {
    email: data.email,
    password: data.password,
  } as SigninPayload;

  const signinResult = await signin(signinPayload);
  if (!signinResult) {
    return Response.json(
      { success: false, errors: { email: ["Invalid email or password"] } },
      { status: 400 }
    );
  }

  const session = await userSession(request);
  session.setUserSession(signinResult.user);
  // Create the response with the user data
  const response = Response.json(
    { success: true, user: signinResult.user },
    {
      headers: {
        "Set-Cookie": await session.commitUserSession(),
      },
    }
  );

  return response;
}
