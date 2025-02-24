import { Router } from "express";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllTemplates,
  getTemplateById,
  sendMailToParticipants,
} from "../../controllers/nm";
import {
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
} from "../../middleware/user";

const nmRouter = Router();

nmRouter.post(
  "/template/create",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  createTemplate
);

nmRouter.put(
  "/template/update",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  updateTemplate
);

nmRouter.delete(
  "/template/delete/:identifier",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  deleteTemplate
);

nmRouter.get(
  "/template/get-all",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  getAllTemplates
);

nmRouter.get(
  "/template/get/:identifier",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  getTemplateById
);

nmRouter.post(
  "/participants/send-mail",
  isAuthenticated,
  isApikeyAuthenticated,
  isInitiator,
  sendMailToParticipants
);

export default nmRouter;
