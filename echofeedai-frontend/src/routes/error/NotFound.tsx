// This is called a "splat route" and as it's in the root `/app/routes/`
// directory, it's a catchall. If no other routes match, this one will and we
// can know that the user is hitting a URL that doesn't exist. By throwing a
// 404 from the loader, we can force the error boundary to render which will
// ensure the user gets the right status code and we can display a nicer error
// message for them than the Remix and/or browser default.

import { Link, LoaderFunctionArgs, useLocation } from "react-router-dom";
import { GeneralErrorBoundary } from "@/components/error-boundary";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("request", request);
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  // due to the loader, this component will never be rendered, but we'll return
  // the error boundary just in case.
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const location = useLocation();
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="container flex h-screen items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <Alert className="flex flex-col gap-2 p-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>404 Error</AlertTitle>
                  <AlertDescription>Page not found</AlertDescription>
                </Alert>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  We couldn't find the page you're looking for:
                </p>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm py-6">
                  {location.pathname}
                </code>
              </CardContent>

              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link to="/home" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ),
      }}
    />
  );
}
