import { type ActionFunctionArgs } from "react-router-dom";
import { signin } from "@/services/auth.server";
import { SigninPayload, User } from "@/types/user";
import { getUserSession } from "@/services/sessions.server";
import {
  ActionResultError,
  ActionResultSuccess,
  ORIGIN,
} from "@/types/action-result";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signinPayload = {
    email: data.email,
    password: data.password,
  } as SigninPayload;

  // parse with zod
  const parsedSigninPayload = signinPayloadSchema.safeParse(signinPayload);
  if (!parsedSigninPayload.success) {
    const result: ActionResultError<any> = {
      success: false,
      origin: parsedSigninPayload.error.issues[0].path[0] as ORIGIN,
      message: parsedSigninPayload.error.issues[0].message,
      data: parsedSigninPayload.data,
    };
    return Response.json(result, { status: 400 });
  }

  // signin
  const signinResult = await signin(parsedSigninPayload.data);

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });
  console.log("debug log 0 - signin.action.ts", cookies);

  if (!signinResult.ok) {
    // 404
    if (signinResult.status === 404) {
      // user with email not found
      const result: ActionResultError<SigninPayload> = {
        success: false,
        origin: "email",
        message: "User not found",
        data: parsedSigninPayload.data,
      };
      return Response.json(result, { status: 401 });
    }
    // 401
    else if (signinResult.status === 401) {
      const result: ActionResultError<SigninPayload> = {
        success: false,
        origin: "password",
        message: "Invalid password",
        data: parsedSigninPayload.data,
      };
      return Response.json(result, { status: 401 });
    }
    // 409
    else if (signinResult.status === 409) {
      const result: ActionResultError<SigninPayload> = {
        success: false,
        origin: "email",
        message: "User not found",
        data: parsedSigninPayload.data,
      };
      return Response.json(result, { status: 409 });
    } else {
      const result: ActionResultError<SigninPayload> = {
        success: false,
        origin: "email",
        message: "Failed to signin",
        data: parsedSigninPayload.data,
      };
      return Response.json(result, { status: 500 });
    }
  }

  // we will get a access token and refresh token in the response
  // we will set the access token in the cookie
  // we will set the refresh token in the cookie
  // we will redirect to the home page

  const signinData = await signinResult.json();
  const session = getUserSession();
  session.setUser(signinData);

  const result: ActionResultSuccess<User> = {
    success: true,
    message: "Signin successful",
    data: { id: signinData.id, email: signinData.email },
  };
  return Response.json(result, { status: 200 });
}
