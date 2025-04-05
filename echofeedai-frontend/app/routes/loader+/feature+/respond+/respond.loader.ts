import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { userSession } from "@/services/sessions.server";
interface QuestionCoverage {
  [key: string]: {
    covered: boolean;
    question: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs): Promise<any> {
  const session = await userSession(request);
  const storedQuestions = session.getUserSession().generatedQuestions;
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
