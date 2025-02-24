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
} from "../../controllers/initiator";
import {
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
} from "../../middleware/user";

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

initiatorRouter.get(
  "/initiate-feedback/:sourceId",
  isApikeyAuthenticated,
  isAuthenticated,
  isInitiator,
  initiateFeedback
);

export default initiatorRouter;
