import { redirect } from "react-router-dom";

interface QuestionCoverage {
  [key: string]: {
    covered: boolean;
    question: string;
  };
}

export async function loader(): Promise<any> {
  const storedQuestions = sessionStorage.getItem("generatedQuestions");
  if (storedQuestions) {
    const parsedQuestions = JSON.parse(storedQuestions);
    // Initialize coverage status for each topic
    const initialCoverage: QuestionCoverage = {};
    Object.keys(parsedQuestions).forEach((topic) => {
      initialCoverage[topic] = {
        covered: false,
        question: parsedQuestions[topic],
      };
    });
    return { parsedQuestions, initialCoverage };
  } else {
    return redirect("/feature/generate");
  }
}
