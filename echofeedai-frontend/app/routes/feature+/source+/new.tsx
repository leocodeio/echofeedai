import { Form, useNavigate, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";

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
import { RefreshCw, Plus } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { action as NewSourceAction } from "@/routes/action+/feature+/source+/new-source.action";

// action
export const action = NewSourceAction;
export const loader = () => {
  return null;
};
// components
const NewSource = () => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const action = useActionData<typeof NewSourceAction>();

  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (action && !action.success) {
      setError(action.message);
    }
  }, [action]);

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Add New Source</CardTitle>
          <CardDescription>
            Create a new source for collecting feedback
          </CardDescription>
        </CardHeader>
        <Form
          method="post"
          onSubmit={handleSubmit}
          action="/feature/source/new"
        >
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
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Source
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

export default NewSource;
