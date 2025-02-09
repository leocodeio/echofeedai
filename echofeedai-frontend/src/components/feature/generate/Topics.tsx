/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6aZyxKXbbxL
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Form } from "react-router-dom";

interface Topic {
  id: number;
  text: string;
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState("");

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([
        ...topics,
        {
          id: Date.now(),
          text:
            newTopic.trim().slice(0, 1).toUpperCase() +
            newTopic.trim().slice(1),
        },
      ]);
      setNewTopic("");
    }
  };

  const deleteTopic = (id: number) => {
    setTopics(topics.filter((topic) => topic.id !== id));
  };

  return (
    <Form
      method="post"
      className="container mx-auto max-w-md px-4 py-8 border space-y-4"
    >
      <h1 className="text-3xl font-bold">Topics</h1>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Add a new topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTopic();
            }
          }}
          className="w-4/5"
        />
        <Button type="button" onClick={addTopic}>
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between rounded-md bg-white px-4 py-2 shadow-sm dark:bg-gray-950 dark:text-white"
          >
            <p>{topic.text}</p>
            <Button
              variant="ghost"
              onClick={() => deleteTopic(topic.id)}
              className="text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-400 dark:hover:text-red-500"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
      {/* hidden input for topics */}
      <input
        type="hidden"
        name="topics"
        value={topics.map((topic) => topic.text).join("#separator#")}
      />
      <Button disabled={topics.length === 0} type="submit">
        Generate
      </Button>
    </Form>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
