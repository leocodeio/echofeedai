import { Router } from "express";
import {
  getParticipantProfile,
  participantSignin,
  participantSignout,
  participantSignup,
  participantFeedbackResponse,
} from "../../controllers/participant";
import {
  isApikeyAuthenticated,
  isAuthenticated,
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

export default participantRouter;
