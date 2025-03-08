/* 

This page is for the user to add a source to their account.

[ ] Display a list of sources that the user has added. /
[ ] Add a source to the user's account. /new
[ ] Delete a source from the user's account. /:id
[ ] Edit a source from the user's account. /:id

*/

import { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash, Edit, RefreshCw } from "lucide-react";
import { loader as SourceListLoader } from "@/functions/loader/feature/source/source.loader";
import { SourceType } from "@/types/source";

const SourceList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const submit = useSubmit();
  const { sources } = useLoaderData<typeof SourceListLoader>() as {
    sources: SourceType[];
  };
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [sources]);

  const handleAddSource = () => {
    navigate("/feature/source/new");
  };

  const handleEditSource = (id: string) => {
    navigate(`/feature/source/edit/${id}`);
  };

  const handleDeleteSource = (id: string) => {
    submit(null, {
      method: "POST",
      action: `/feature/source/delete/${id}`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Sources</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't added any sources yet.
              </p>
              <Button onClick={handleAddSource}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Source
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <CardTitle>{source.companyName}</CardTitle>
                <CardDescription>
                  Created on {new Date(source.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSource(source.id)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSource(source.id)}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* CapCut-style floating action button */}
      <Button
        onClick={handleAddSource}
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
        size="icon"
        aria-label="Add new source"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default function Source() {
  return <SourceList />;
}
