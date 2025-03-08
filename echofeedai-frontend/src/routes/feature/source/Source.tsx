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
import { getDate } from "@/utils/common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, useActionData } from "react-router-dom";
import { ActionResult } from "@/types/action-result";
import { toast } from "@/hooks/use-toast";
import { Tag, TagInput } from "emblor";

const SourceList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const submit = useSubmit();
  const { sources } = useLoaderData<typeof SourceListLoader>() as {
    sources: SourceType[];
  };
  const [showAddParticipant, setShowAddParticipant] = useState<string | null>(
    null
  );
  const actionData = useActionData<ActionResult<any>>();
  const [participantTags, setParticipantTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [sources]);

  useEffect(() => {
    if (actionData?.success) {
      toast({
        title: "Success",
        description: actionData.message,
      });
      setShowAddParticipant(null);
    } else if (actionData?.success === false) {
      toast({
        title: "Error",
        description: actionData.message,
        variant: "destructive",
      });
    }
  }, [actionData]);

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

  const handleAddParticipant = (id: string) => {
    setShowAddParticipant(id);
  };

  const handleParticipantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantTags.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one participant",
        variant: "destructive",
      });
      return;
    }

    submit(
      { participantName: participantTags.map((tag) => tag.text).join(",") },
      {
        method: "post",
        action: `/feature/source/add-participant/${showAddParticipant}`,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative w-full">
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-bold text-center w-full">
          Feedback Sources
        </h1>
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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <CardTitle>{source.companyName}</CardTitle>
                <CardDescription>
                  Created on {getDate(source.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSource(source.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddParticipant(source.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Participant
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSource(source.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card>
            <CardContent className="pt-6 flex justify-center items-center h-full">
              <Button
                onClick={handleAddSource}
                variant="outline"
                className="rounded-full h-16 w-16"
                aria-label="Add new source"
              >
                <Plus className="h-12 w-12" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddParticipant && (
        <Dialog
          open={!!showAddParticipant}
          onOpenChange={() => setShowAddParticipant(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Participant</DialogTitle>
              <DialogDescription>
                Enter participant names to add them to this source
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleParticipantSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="participantName">Participant Names</Label>
                  <TagInput
                    id="participantName"
                    tags={participantTags}
                    setTags={setParticipantTags}
                    placeholder="Type a name and press Enter"
                    styleClasses={{
                      tagList: {
                        container: "flex gap-2",
                      },
                      input:
                        "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[1px] focus-visible:ring-ring/50 mb-2",
                      tag: {
                        body: "relative h-7 w-auto bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                        closeButton:
                          "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                      },
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inlineTags={false}
                    inputFieldPosition="top"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddParticipant(null);
                    setParticipantTags([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Participants</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default function Source() {
  return <SourceList />;
}
