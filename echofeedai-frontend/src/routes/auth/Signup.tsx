import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link } from "react-router-dom";
import { UserInput } from "@/components/self/user-input";
import { useState } from "react";

export default function Signup() {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error state
  const [error, setError] = useState<{ type: string; message: string } | null>(
    null
  );

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <UserInput
                  id="email"
                  className="grid gap-2"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={error?.type === "email" ? error.message : ""}
                />
              </div>
              <div className="grid gap-2">
                <UserInput
                  id="password"
                  className="grid gap-2"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <UserInput
                  id="confirmPassword"
                  className="grid gap-2"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password !== e.target.value) {
                      setError({
                        type: "password",
                        message: "Passwords do not match",
                      });
                    } else {
                      setError(null);
                    }
                  }}
                  error={error?.type === "password" ? error.message : ""}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <Button variant="outline" className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link to="/auth/signin" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
