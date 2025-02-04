import { type ActionFunctionArgs } from "react-router-dom";
import { signin, signup } from "@/services/auth.server";
import { SigninPayload, SignupPayload, User } from "@/types/user";
import {
  ActionResultError,
  ActionResultSuccess,
  ORIGIN,
} from "@/types/action-result";
import { signupPayloadSchema } from "@/services/schemas/signup.schema";
import { getUserSession } from "@/services/sessions.server";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const signupPayload = {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  } as SignupPayload;

  // parse with zod
  const parsedSignupPayload = signupPayloadSchema.safeParse(signupPayload);
  if (!parsedSignupPayload.success) {
    const result: ActionResultError<any> = {
      success: false,
      origin: parsedSignupPayload.error.issues[0].path[0] as ORIGIN,
      message: parsedSignupPayload.error.issues[0].message,
      data: parsedSignupPayload.data,
    };
    return Response.json(result, { status: 400 });
  }
  // check if password and confirm password match
  if (
    parsedSignupPayload.data.password !==
    parsedSignupPayload.data.confirmPassword
  ) {
    const result: ActionResultError<SignupPayload> = {
      success: false,
      origin: "password",
      message: "password and confirm password do not match",
      data: parsedSignupPayload.data,
    };
    return Response.json(result, { status: 400 });
  }

  const signupReponse = await signup(parsedSignupPayload.data);
  if (!signupReponse.ok) {
    // 409
    if (signupReponse.status === 409) {
      const result: ActionResultError<SignupPayload> = {
        success: false,
        origin: "email",
        message: "User already exists",
        data: parsedSignupPayload.data,
      };
      return Response.json(result, { status: 409 });
    }
    // 500
    else if (signupReponse.status === 500) {
      const result: ActionResultError<SignupPayload> = {
        success: false,
        origin: "email",
        message: "Failed to signup",
        data: parsedSignupPayload.data,
      };
      return Response.json(result, { status: 500 });
    } else {
      const result: ActionResultError<SignupPayload> = {
        success: false,
        origin: "email",
        message: "Failed to signup",
        data: parsedSignupPayload.data,
      };
      return Response.json(result, { status: 500 });
    }
  }

  // No need for session we will redirect to signin page
  // we will get the user from the response

  const signinPayload = {
    email: parsedSignupPayload.data.email,
    password: parsedSignupPayload.data.password,
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
    message: "Signed Up and Signed In successfully",
    data: { id: signinData.id, email: signinData.email },
  };
  return Response.json(result, { status: 200 });
}
