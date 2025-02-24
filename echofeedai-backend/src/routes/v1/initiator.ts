import { Router } from "express";
import {
  getInitiatorProfile,
  initiatorSignin,
  getSources,
  initiatorSignout,
  initiatorSignup,
  addSource,
  getSourceById,
} from "../../controllers/initiator";
import { isApikeyAuthenticated, isAuthenticated } from "../../middleware/user";

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
  addSource
);

initiatorRouter.get(
  "/sources",
  isApikeyAuthenticated,
  isAuthenticated,
  getSources
);

initiatorRouter.get(
  "/source/:id",
  isApikeyAuthenticated,
  isAuthenticated,
  getSourceById
);

export default initiatorRouter;
