import { useState } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Mic, Square } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Form } from 'react-router-dom';

interface Message {
  content: string;
  timestamp: Date;
}

const Respond = () => {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [outputMessage, setOutputMessage] = useState<string>('');
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
    setOutputMessage(outputMessage +" "+ transcript);
    setIsRecording(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
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
                <h3 className="text-sm font-medium mb-2">Real-time Transcription:</h3>
                <p className="text-sm">{transcript}</p>
              </div>
            )}

            <ScrollArea className="h-[400px] rounded-md p-4">
              {!currentMessage ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start recording to see transcription
                </div>
              ) : (
                <Form method="post" className="p-4 rounded-lg bg-muted mr-4">
                    <span className="text-sm font-bold text-gray-500 mb-4">
                      Your feedback response :
                    </span>
                  <p id="outputMessage" className="text-sm my-4">{outputMessage}</p>
                  <Button className="mt-4" type="submit">Submit</Button>
                </Form>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Respond;
