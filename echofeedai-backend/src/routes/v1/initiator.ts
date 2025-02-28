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
  addParticipant,
  deleteSource,
  updateSource,
} from "../../controllers/initiator";
import {
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
} from "../../middleware/user";
import { isAdminApikeyAuthenticated } from "../../middleware/admin";
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
  isAdminApikeyAuthenticated,
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

initiatorRouter.post(
  "/add-participant",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  addParticipant
);


export default initiatorRouter;
