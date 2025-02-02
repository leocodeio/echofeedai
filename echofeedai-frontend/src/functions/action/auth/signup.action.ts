import { type ActionFunctionArgs } from "react-router-dom";
import { signup } from "@/services/auth.server";
import { SignupPayload, User } from "@/types/user";
import {
  ActionResultError,
  ActionResultSuccess,
  ORIGIN,
} from "@/types/action-result";
import { signupPayloadSchema } from "@/services/schemas/signup.schema";

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

  const signupData = await signupReponse.json();
  const result: ActionResultSuccess<User> = {
    success: true,
    message: "Signup successful",
    data: { id: signupData.id, email: signupData.email },
  };
  return Response.json(result, {
    status: 201,
  });
}
