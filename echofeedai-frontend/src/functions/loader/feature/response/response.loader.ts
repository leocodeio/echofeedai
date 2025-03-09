import { redirect } from "react-router-dom";
import { getUserSession } from "@/services/sessions.server";
import { NavLinks } from "@/models/navlinks";
interface QuestionCoverage {
  [key: string]: {
    covered: boolean;
    question: string;
  };
}

export async function loader({ request }: { request: Request }): Promise<any> {
  const session = getUserSession();
  const pathname = new URL(request.url).pathname;
  const neededRoles = NavLinks.find((link) => pathname.includes(link.to))?.role;
  const isRole = session.getIsRole(neededRoles || []);
  if (!isRole) {
    return redirect("/home");
  }

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
