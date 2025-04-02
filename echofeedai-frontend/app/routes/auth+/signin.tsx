import { MetaFunction } from "@remix-run/node";
import { LoginForm } from "~/components/auth/login-form";
import { loader as signinLoader } from "../loader+/auth+/signin";
import { action as signinAction } from "../action+/auth+/signin";

export const meta: MetaFunction = () => {
  return [
    { title: "Spectral SignIn" },
    { name: "description", content: "SignIn to Spectral" },
  ];
};

export const loader = signinLoader;
export const action = signinAction;

export default function Signin() {
  return <LoginForm />;
}
