import { Router } from "express";
import {
  getParticipantProfile,
  participantSignin,
  participantSignout,
  participantSignup,
  participantFeedbackResponse,
  getParticipantByName,
  getParticipantById,
  addFeedbackResponse,
  canRespond
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

participantRouter.get(
  "/byId/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getParticipantById
);

participantRouter.post(
  "/add-response/:feedbackInitiateId",
  isApikeyAuthenticated,
  isAuthenticated,
  isParticipant,
  addFeedbackResponse
);

participantRouter.get(
  "/can-respond/:feedbackInitiateId",
  isApikeyAuthenticated,
  isAuthenticated,
  isParticipant,
  canRespond
);

export default participantRouter;
