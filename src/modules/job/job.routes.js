import express from "express";
import auth from "../../middleware/auth.js";
import companyHR from "../../middleware/companyHR.js";
import * as JC from "./controllers/job.controller.js";
import * as JV from "./job.validation.js";
import validation from "../../middleware/validation.js";

const jobRouter = express.Router();

jobRouter.post("/", auth, companyHR, validation(JV.addJobValidation), JC.addJob);
jobRouter.put("/:id", auth, companyHR, validation(JV.addJobValidation), JC.updateJob);
jobRouter.delete("/:id", auth, companyHR, JC.deleteJob);
jobRouter.get("/allJobs", auth,  JC.allJobs);

export default jobRouter;
// addJobValidation
