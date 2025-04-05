import { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ActionResult } from "@/types/action-result";

interface Message {
  content: string;
  timestamp: Date;
}

interface QuestionCoverage {
  [key: string]: {
    covered: boolean;
    question: string;
  };
}

const Response = () => {
  const actionData = useActionData<ActionResult<any>>();
  const { parsedQuestions, initialCoverage } = useLoaderData<any>();

  // State variables
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [outputMessage, setOutputMessage] = useState<string>("");
  const [questions, setQuestions] = useState<{ [key: string]: string }>({});
  const [coverage, setCoverage] = useState<QuestionCoverage>({});

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Load initial questions and coverage
  useEffect(() => {
    setQuestions(
      Object.keys(parsedQuestions).reduce((acc, key) => {
        acc[key.toLowerCase()] = parsedQuestions[key];
        return acc;
      }, {} as { [key: string]: string })
    );

    setCoverage(
      Object.keys(initialCoverage).reduce((acc, key) => {
        acc[key.toLowerCase()] = initialCoverage[key];
        return acc;
      }, {} as QuestionCoverage)
    );
  }, [parsedQuestions, initialCoverage]);

  // Process actionData updates
  useEffect(() => {
    if (actionData?.data) {
      const coverageData = actionData.data;
      const newCoverage = { ...coverage }; // Create a copy of existing coverage

      // Mark covered topics
      coverageData.covered.forEach((item: any) => {
        newCoverage[item.topic.toLowerCase()] = {
          covered: true,
          question: questions[item.topic.toLowerCase()],
        };
      });

      // Mark not covered topics
      coverageData.not_covered.forEach((item: any) => {
        newCoverage[item.topic.toLowerCase()] = {
          covered: false,
          question: questions[item.topic.toLowerCase()],
        };
      });

      setCoverage(newCoverage);
    }
  }, [actionData, questions]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsRecording(true);
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    setCurrentMessage({
      content: transcript,
      timestamp: new Date(),
    });
    setOutputMessage(outputMessage + " " + transcript);
    setIsRecording(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feedback Recording Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Feedback Recording</h2>
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} variant="outline">
                    <Mic className="h-4 w-4 mr-2" />
                    Record
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>

            {isRecording && (
              <div className="mb-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">
                  Real-time Transcription:
                </h3>
                <p className="text-sm">{transcript}</p>
              </div>
            )}

            <ScrollArea className="h-[400px] rounded-md p-4">
              {!currentMessage ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start recording to see transcription
                </div>
              ) : (
                <>
                  <span className="text-sm font-bold text-gray-500 mb-4">
                    Your feedback response:
                  </span>
                  <p id="outputMessage" className="text-sm my-4">
                    {outputMessage}
                  </p>
                </>
              )}
            </ScrollArea>

            <Form method="post">
              <input type="hidden" name="feedback" value={outputMessage} />
              <input
                type="hidden"
                name="questionsByTopic"
                value={JSON.stringify(questions)}
              />
              <Button disabled={!outputMessage} className="mt-4" type="submit">
                Submit
              </Button>
            </Form>
          </CardContent>
        </Card>

        {/* Topics Coverage Section */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Topics to Cover:</h3>
              <div className="space-y-2">
                {Object.entries(questions).map(([topic, question]) => {
                  const isCovered =
                    coverage[topic.toLowerCase()]?.covered || false;
                  return (
                    <div
                      key={topic}
                      className={`p-3 rounded-md border transition-colors ${
                        isCovered
                          ? "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:border-green-500 dark:text-green-100"
                          : "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:border-red-500 dark:text-red-100"
                      }`}
                    >
                      <p className="font-medium text-sm">{topic}</p>
                      <p
                        className={`text-sm ${
                          isCovered
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {question}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Response;
