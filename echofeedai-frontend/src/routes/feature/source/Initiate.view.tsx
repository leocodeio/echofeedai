import { Form, useLoaderData, useActionData } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loader as InitiateViewLoader } from "@/functions/loader/feature/source/view-initiate";
import { action as SendEmailsAction } from "@/functions/action/feature/source/intitiate-send-emails.action";
import { RefreshCw, List, ListChecks, Send, UserRoundIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const InitiateView = () => {
  // [TODO] - any?
  // loader
  const { topics, questions, responses } = useLoaderData<
    typeof InitiateViewLoader
  >() as {
    topics: any[];
    questions: any[];
    responses: any[];
  };
  console.log("responses", responses);
  //action
  const action = useActionData<typeof SendEmailsAction>();
  const navigate = useNavigate();
  useEffect(() => {
    if (action?.success) {
      toast({
        title: "Success",
        description: action.message,
      });
      navigate("/feature/source");
    }
  }, [action]);

  // params
  const params = useParams();
  // state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  // loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* Topics Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        onClick={() => setShowTopics(true)}
      >
        <List />
        <p className="text-xs text-center">Topics</p>
      </Button>

      {/* Topics Dialog */}
      <Dialog open={showTopics} onOpenChange={setShowTopics}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Topics</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {topics?.map((topic) => (
              <div key={topic.tid} className="py-2">
                {topic.name}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Topics Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        onClick={() => setShowResponses(true)}
      >
        <List />
        <p className="text-xs text-center">Responses</p>
      </Button>

      {/* Topics Dialog */}
      <Dialog open={showResponses} onOpenChange={setShowResponses}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responses</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {responses?.map((response) => (
              <div key={response.id} className="py-2">
                <div className="flex flex-row justify-between">
                <p className="text-xs flex flex-row items-center gap-2 mb-2 ">
                  <UserRoundIcon className="w-4 h-4" /> {response.participant.name}
                  </p>
                  <p className="text-xs text-center">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {response.response}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Questions Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        onClick={() => setShowQuestions(true)}
      >
        <ListChecks />
        <p className="text-xs text-center">Questions</p>
      </Button>

      {/* Questions Dialog */}
      <Dialog open={showQuestions} onOpenChange={setShowQuestions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Questions</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {questions?.map((question) => (
              <div key={question.tid} className="py-2">
                {question.name}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Feedback Initiative Button */}
      <Form method="post">
        <input type="hidden" name="feedbackInitiateId" value={params.id} />
        <Button
          variant="ghost"
          size="icon"
          type="submit"
          className="flex flex-col  justify-center items-center h-24 w-24 p-4"
        >
          <Send />
          <p className="text-xs text-center">Send Mails</p>
        </Button>
      </Form>
    </div>
  );
};
