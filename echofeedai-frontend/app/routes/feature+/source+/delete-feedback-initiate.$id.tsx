import { action as deleteFeedbackInitiateAction } from "@/routes/action+/feature+/source+/delete-feedback-initiate.action";
import { redirect } from "@remix-run/node";
export const action = deleteFeedbackInitiateAction;
export const loader = () => {
  return redirect("/feature/source");
};

const DeleteFeedbackInitiate = () => {
  return null;
};

export default DeleteFeedbackInitiate;
