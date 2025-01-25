import { json, type ActionFunctionArgs } from "@remix-run/node";
import { signin } from "~/services/auth.server";
import { SigninPayload } from "~/types/user";
import { userSession } from "~/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signinPayload = {
    email: data.email,
    password: data.password,
  } as SigninPayload;
  const signinResult = await signin(signinPayload);
  if (!signinResult) {
    return json(
      { success: false, errors: { email: ["Invalid email or password"] } },
      { status: 400 }
    );
  }
  console.log(signinResult);
  const session = await userSession(request);
  session.setUserSession(signinResult.user);
  console.log(session.getUserSession());
  return json(
    { success: true, user: signinResult.user },
    {
      headers: {
        "Set-Cookie": await session.commitUserSession(),
      },
    }
  );
}
