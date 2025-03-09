import { Form, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

import { loader as InitiateViewLoader } from "@/functions/loader/feature/source/view-initiate";
import { RefreshCw, List, ListChecks, Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export const InitiateView = () => {
  const params = useParams();
  //   console.log(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // [TODO] - any?
  const { topics, questions } = useLoaderData<typeof InitiateViewLoader>() as {
    topics: any[];
    questions: any[];
  };
  const [showTopics, setShowTopics] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
//   console.log(topics, questions);
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
