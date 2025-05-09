import {
  Form,
  useLoaderData,
  useNavigate,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { loader as SourceViewLoader } from "@/routes/loader+/feature+/source+/view-source.loder";
import { Plus, RefreshCw, Trash, Users, ArrowRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDate } from "@/utils/common";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams } from "@remix-run/react";
import { action as SourceViewAction } from "@/routes/action+/feature+/source+/create-feedback-initiate.action";
import { toast } from "@/hooks/use-toast";
import { Tag, TagInput } from "emblor";

export const loader = SourceViewLoader;
export const action = SourceViewAction;

const SourceView = () => {
  // [TODO] - any?
  const { participants, feedbackInitiatives, mailTemplateIdentifiers } =
    useLoaderData<typeof SourceViewLoader>() as {
      participants: any[];
      feedbackInitiatives: any[];
      mailTemplateIdentifiers: any[];
    };

  //action
  const action = useActionData<typeof SourceViewAction>();
  useEffect(() => {
    if (action?.success) {
      toast({
        title: "Success",
        description: action.message,
      });
      setCreateInitiativeLoading(false);
      setShowCreateFeedbackInitiative(false);
    }
  }, [action]);
  // params
  const params = useParams();
  // navigate
  const navigate = useNavigate();
  // states
  const [loading, setLoading] = useState(true);
  const [createInitiativeLoading, setCreateInitiativeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [topicTags, setTopicTags] = useState<Tag[]>([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(null);
  const submit = useSubmit();
  const [showCreateFeedbackInitiative, setShowCreateFeedbackInitiative] =
    useState(false);
  // console.log(participants);
  // console.log(feedbackInitiatives);
  // console.log(mailTemplateIdentifiers);
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  const handleDeleteFeedbackInitiative = (id: string) => {
    submit(null, {
      method: "post",
      action: `/feature/source/delete-feedback-initiate/${id}`,
    });
  };

  return (
    <div className="container mx-auto flex flex-col gap-6">
      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Participants Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        onClick={() => setShowParticipants(true)}
      >
        <Users />
        <p className="text-xs text-center">Participants</p>
      </Button>

      {/* Participants Dialog */}
      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participants</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {participants?.map((participant) => (
              <div key={participant.id} className="py-2">
                {participant.name}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Initiative Card */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* get already created feedback initiatives */}
        {feedbackInitiatives?.map((feedbackInitiative) => (
          <Card key={feedbackInitiative.id}>
            <CardHeader>
              <CardTitle>{feedbackInitiative.name}</CardTitle>
              <CardDescription>
                Created on {getDate(feedbackInitiative.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleDeleteFeedbackInitiative(feedbackInitiative.id)
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    `/feature/source/initiative/view/${feedbackInitiative.id}`
                  )
                }
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* create Feedback Initiative Dialog */}
        <Dialog
          open={showCreateFeedbackInitiative}
          onOpenChange={setShowCreateFeedbackInitiative}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Topics</DialogTitle>
              <DialogDescription>
                Enter topic names to add them to this source
              </DialogDescription>
            </DialogHeader>
            <Form
              method="post"
              onSubmit={() => {
                setCreateInitiativeLoading(true);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="topicName">Topic Names</Label>
                  <TagInput
                    id="topicName"
                    tags={topicTags}
                    setTags={setTopicTags}
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
                    activeTagIndex={activeTopicIndex}
                    setActiveTagIndex={setActiveTopicIndex}
                    inlineTags={false}
                    inputFieldPosition="top"
                  />
                </div>
              </div>
              <Select name="mailTemplateIdentifier">
                <SelectTrigger>
                  <SelectValue placeholder="Select a mail template" />
                </SelectTrigger>
                <SelectContent>
                  {mailTemplateIdentifiers?.map((mailTemplateIdentifier) => (
                    <SelectItem
                      key={mailTemplateIdentifier.id}
                      value={mailTemplateIdentifier.identifier}
                    >
                      {mailTemplateIdentifier.identifier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="mt-4"
                type="submit"
                disabled={createInitiativeLoading}
              >
                {createInitiativeLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create Initiative
              </Button>
              <input
                type="hidden"
                name="topics"
                value={topicTags?.map((tag) => tag.text).join(",")}
              />
              <input type="hidden" name="sourceId" value={params.id} />
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Create Feedback Initiative Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        onClick={() => setShowCreateFeedbackInitiative(true)}
      >
        <Plus />
        <p className="text-xs text-center">Create</p>
      </Button>
    </div>
  );
};

export default SourceView;
