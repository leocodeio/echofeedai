import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { getErrorMessage } from "@/utils/misc";
import { AlertCircle, Ban, Bug } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <DefaultErrorComponent
      title={`${error.status} Error`}
      message={error.data}
      icon={Ban}
    />
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => (
    <DefaultErrorComponent
      title="Unexpected Error"
      message={getErrorMessage(error)}
      icon={Bug}
      variant="destructive"
    />
  ),
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== "undefined") {
    console.error(error);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="text-center">
        {isRouteErrorResponse(error)
          ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
              error,
              params,
            })
          : unexpectedErrorHandler(error)}
      </div>
    </div>
  );
}

function DefaultErrorComponent({
  title,
  message,
  icon: Icon = AlertCircle,
  variant = "default",
}: {
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
}) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-2 pb-2">
        <Alert variant={variant} className="justify-center">
          <Icon className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        </Alert>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <AlertDescription className="text-base text-muted-foreground">
          {message}
        </AlertDescription>
        {variant === "destructive" && (
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
