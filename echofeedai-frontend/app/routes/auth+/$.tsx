import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link, useRouteError } from "@remix-run/react";

export const AuthErrorBoundary = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 p-4">
      <Alert className="w-full max-w-md" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <p>Backend Server did not respond correctly</p>
      </Alert>
      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
};
