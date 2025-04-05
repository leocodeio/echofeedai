import { MetaFunction } from "@remix-run/node";
import { SignupForm } from "~/components/auth/signup-form";
import { action as signupAction } from "../action+/auth+/signup";
import { loader as signupLoader } from "../loader+/auth+/signup";

export const meta: MetaFunction = () => {
  return [
    { title: "Spectral Signup" },
    { name: "description", content: "Signup to Spectral" },
  ];
};

export const loader = signupLoader;
export const action = signupAction;

export default function Signup() {
  return <SignupForm />;
}
