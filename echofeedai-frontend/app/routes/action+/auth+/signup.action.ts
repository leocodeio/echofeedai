import { type ActionFunctionArgs } from "@remix-run/node";
import { signin, signup } from "@/services/auth.server";
import { SigninPayload, SignupPayload, User } from "@/types/user";
import {
  ActionResultError,
  ActionResultSuccess,
  ORIGIN,
} from "@/types/action-result";
import { signupPayloadSchema } from "@/services/schemas/signup.schema";
import { userSession } from "@/services/sessions.server";
import { signinPayloadSchema } from "@/services/schemas/signin.schema";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const signupPayload = {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    role: data.role,
    name: data.name,
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
        message: "Failed to signup due to backend server error",
        data: parsedSignupPayload.data,
      };
      return Response.json(result, { status: 500 });
    } else if (signupReponse.status === 401 || signupReponse.status === 403) {
      const result: ActionResultError<SignupPayload> = {
        success: false,
        origin: "email",
        message: "Failed to signup due to invalid authorization",
        data: parsedSignupPayload.data,
      };
      return Response.json(result, { status: 401 });
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
    role: parsedSignupPayload.data.role,
  } as SigninPayload;
  console.log("debug log 0 - signup.action.ts", signinPayload);

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
  const cookies = signinResult.headers
    .get("set-cookie")
    ?.split(",") as string[];
  console.log("debug log 0 - signin.action.ts", cookies);
  if (cookies.length !== 4) {
    const result: ActionResultError<SigninPayload> = {
      success: false,
      origin: "email",
      message: "Failed to signin",
      data: parsedSigninPayload.data,
    };
    return Response.json(result, { status: 500 });
  }
  const signinData = await signinResult.json();
  console.log("debug log 1 - signin.action.ts", signinData);
  const session = await userSession(request);
  console.log("debug log 2 - signin.action.ts", session);
  session.setUser(cookies[0] + "," + cookies[1], cookies[2] + "," + cookies[3]);
  console.log("debug log 3 - signin.action.ts", session.getUser());
  const result: ActionResultSuccess<User> = {
    success: true,
    message: "Signin successful",
    data: null,
  };
  return Response.json(result, {
    status: 200,
    headers: {
      "Set-Cookie": await session.commitSession(),
    },
  });
}
