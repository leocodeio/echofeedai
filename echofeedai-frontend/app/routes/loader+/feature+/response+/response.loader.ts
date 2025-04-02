import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "@/services/sessions.server";
import { NavLinks } from "@/models/navlinks";
import { getFeedbackInitiative, canRespond } from "@/services/source.server";
interface QuestionCoverage {
  [key: string]: {
    covered: boolean;
    question: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs): Promise<any> {
  const session = await getUserSession(request);
  const pathname = new URL(request.url).pathname;
  console.log("pathname", pathname);
  const neededRoles = NavLinks.find((link) => pathname.includes(link.to))?.role;
  console.log("neededRoles", neededRoles);
  const isRole = session.getIsRole(neededRoles || []);
  console.log("isRole", isRole);
  if (!isRole) {
    return redirect("/home");
  }
  // query params to get feedback initiate id
  const feedbackInitiateId = new URL(request.url).searchParams.get(
    "feedbackInitiateId"
  );
  if (!feedbackInitiateId) {
    return redirect("/home");
  }

  const canRespondResponse = await canRespond(feedbackInitiateId);
  if (!canRespondResponse.ok) {
    return redirect("/home");
  }

  // get feedback initiate
  const feedbackInitiative = await getFeedbackInitiative(feedbackInitiateId);
  if (!feedbackInitiative) {
    return redirect("/home");
  }



  // get feedback initiate questions
  const feedbackInitiativeData = await feedbackInitiative.json();
  console.log("feedbackInitiativeData", feedbackInitiativeData);
  const questions = feedbackInitiativeData.payload.questions;
  console.log("questions", questions);
  const topics = feedbackInitiativeData.payload.topics;
  console.log("topics", topics);

  // create a map of topic as key and question as values
  const questionsByTopic: { [key: string]: string } = {};
  for (let i = 0; i < topics?.length; i++) {
    if (questions[i]) {
      questionsByTopic[topics[i]] = questions[i];
    }
  }
  console.log("questionsByTopic", questionsByTopic);
  // const storedQuestions = sessionStorage.getItem("generatedQuestions");
  if (questionsByTopic) {
    const parsedQuestions = questionsByTopic;
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
    return redirect("/home");
  }
}
