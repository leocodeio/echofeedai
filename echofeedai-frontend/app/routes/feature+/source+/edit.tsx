import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useActionData } from "@remix-run/react";
import { SourceType } from "@/types/source";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { loader as EditSourceLoader } from "@/routes/loader+/feature+/source+/edit-source.loader";
import { action as EditSourceAction } from "@/routes/action+/feature+/source+/edit-source.action";
import { Form } from "@remix-run/react";

export const loader = EditSourceLoader;
export const action = EditSourceAction;

const EditSource = () => {
  const [source, setSource] = useState<SourceType | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data } = useLoaderData<typeof EditSourceLoader>();
  const action = useActionData<typeof EditSourceAction>();

  // handle action
  useEffect(() => {
    if (action) {
      if (!action.success) {
        setError(action.message);
      }
    }
  }, [action]);

  // set variables
  useEffect(() => {
    if (data) {
      setSource(data);
      setCompanyName(data.companyName || "");
    }
    setLoading(false);
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!source && !loading) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Source not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Edit Source</CardTitle>
          <CardDescription>Update your source information</CardDescription>
        </CardHeader>
        <Form method="post" action={`/feature/source/edit/${source?.id}`}>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/feature/source")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Update Source
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default EditSource;
