import { Router } from "express";
import {
  getInitiatorProfile,
  initiatorSignin,
  getSources,
  initiatorSignout,
  initiatorSignup,
  addSource,
  getSourceById,
  initiateFeedback,
  deleteFeedbackInitiate,
  deleteSource,
  updateSource,
  getFeedbackInitiates,
  addParticipant,
  getParticipants,
  removeParticipants,
  getFeedbackInitiate,
} from "../../controllers/initiator";
import {
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
} from "../../middleware/user";
// import { isAdminApikeyAuthenticated } from "../../middleware/admin";

const initiatorRouter = Router();

initiatorRouter.post("/signup", isApikeyAuthenticated, initiatorSignup);

initiatorRouter.post("/signin", isApikeyAuthenticated, initiatorSignin);

initiatorRouter.get(
  "/signout",
  isApikeyAuthenticated,
  isAuthenticated,
  initiatorSignout
);

initiatorRouter.get(
  "/profile",
  isApikeyAuthenticated,
  isAuthenticated,
  getInitiatorProfile
);

initiatorRouter.post(
  "/add-source",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  addSource
);

initiatorRouter.put(
  "/update-source/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  updateSource
);

initiatorRouter.delete(
  "/delete-source/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  // isAdminApikeyAuthenticated,
  deleteSource
);

initiatorRouter.get(
  "/sources",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getSources
);

initiatorRouter.get(
  "/source/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getSourceById
);

initiatorRouter.post(
  "/initiate-feedback",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  initiateFeedback
);

initiatorRouter.get(
  "/feedback-initiate/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  // isInitiator, 
  getFeedbackInitiate
);

initiatorRouter.delete(
  "/delete-feedback-initiate/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  deleteFeedbackInitiate
);

initiatorRouter.get(
  "/feedback-initiates/:sourceId",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getFeedbackInitiates
);

initiatorRouter.post(
  "/add-participant",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  addParticipant
);

initiatorRouter.get(
  "/source/participants/:sourceId",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  getParticipants
);

initiatorRouter.delete(
  "/source/:sourceId/participants/:participantId",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  removeParticipants
);


export default initiatorRouter;
