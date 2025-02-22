import { Router } from "express";
import {
  getParticipantProfile,
  participantSignin,
  participantSignout,
  participantSignup,
} from "../../controllers/participant";
import { isApikeyAuthenticated, isAuthenticated } from "../../middleware/user";

const participantRouter = Router();

participantRouter.post("/signup", isApikeyAuthenticated, participantSignup);

participantRouter.post("/signin", isApikeyAuthenticated, participantSignin);

participantRouter.get(
  "/signout",
  isApikeyAuthenticated,
  isAuthenticated,
  participantSignout
);

participantRouter.get(
  "/profile",
  isApikeyAuthenticated,
  isAuthenticated,
  getParticipantProfile
);

export default participantRouter;
