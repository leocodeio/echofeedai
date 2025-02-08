import { Router } from "express";
import {
  generateQuestions,
  getCoverage,
} from "../../controllers/model";
import { isAuthenticated, isApikeyAuthenticated } from "../../middleware/user";


const modelRouter = Router();

modelRouter.post("/generate-questions", isApikeyAuthenticated, isAuthenticated, generateQuestions);
modelRouter.post("/get-coverage", isApikeyAuthenticated, isAuthenticated, getCoverage);

export default modelRouter;