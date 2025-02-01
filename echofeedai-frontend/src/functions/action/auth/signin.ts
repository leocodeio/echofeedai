import { type ActionFunctionArgs } from "react-router-dom";
import { signin } from "@/services/auth.server";
import { SigninPayload } from "@/types/user";
import { getUserSession } from "@/services/sessions.server";

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

  const session = getUserSession();
  session.setUser(signinResult.user);

  return Response.json({ success: true });
}
