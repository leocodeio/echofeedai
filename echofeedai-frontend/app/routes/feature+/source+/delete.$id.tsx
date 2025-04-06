import { action as deleteSourceAction } from "@/routes/action+/feature+/source+/delete-source.action";
import { redirect } from "@remix-run/node";
export const action = deleteSourceAction;
export const loader = () => {
  return redirect("/feature/source");
};
