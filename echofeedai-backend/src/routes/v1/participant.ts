import { Router } from "express";
import {
  getParticipantProfile,
  participantSignin,
  participantSignout,
  participantSignup,
  participantFeedbackResponse,
  getParticipantByName,
} from "../../controllers/participant";
import {
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  isParticipant,
} from "../../middleware/user";

const participantRouter = Router();

participantRouter.post("/signup", isApikeyAuthenticated, participantSignup);

participantRouter.post("/signin", isApikeyAuthenticated, participantSignin);

participantRouter.get(
  "/signout",
  isApikeyAuthenticated,
  isAuthenticated,
  isParticipant,
  participantSignout
);

participantRouter.get(
  "/profile",
  isApikeyAuthenticated,
  isAuthenticated,
  isParticipant,
  getParticipantProfile
);

participantRouter.post(
  "/feedback-response",
  isApikeyAuthenticated,
  isAuthenticated,
  isParticipant,
  participantFeedbackResponse
);

participantRouter.get(
  "/byName/:name",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getParticipantByName
);
export default participantRouter;
