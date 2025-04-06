import { action as AddParticipantAction } from "@/routes/action+/feature+/source+/add-participant-source.action";
import { redirect } from "@remix-run/node";

export const action = AddParticipantAction;

export const loader = () => {
  return redirect("/feature/source");
};

const AddParticipant = () => {
  return null;
};

export default AddParticipant;
