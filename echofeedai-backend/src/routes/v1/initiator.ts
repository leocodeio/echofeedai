import { Router } from "express";
import {
  addSource,
  getInitiatorProfile,
  initiatorSignin,
  initiatorSignout,
  initiatorSignup,
} from "../../controllers/initiator";
import { isApikeyAuthenticated, isAuthenticated } from "../../middleware/user";

const initiatorRouter = Router();

initiatorRouter.post("/signup", isApikeyAuthenticated, initiatorSignup);

initiatorRouter.post("/signin", isApikeyAuthenticated, initiatorSignin);

initiatorRouter.get("/signout", isApikeyAuthenticated, isAuthenticated, initiatorSignout);

initiatorRouter.get("/profile", isApikeyAuthenticated, isAuthenticated, getInitiatorProfile);

initiatorRouter.post("/add-source", isApikeyAuthenticated, isAuthenticated, addSource);

export default initiatorRouter;
