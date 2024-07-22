import applicationModel from "../../../../DB/models/applicationModel.js";
import companyModel from "../../../../DB/models/companyModel.js";
import jobModel from "../../../../DB/models/jobModel.js";
import userModel from "../../../../DB/models/uesrModel.js";
import asyncHandler from "../../../middleware/asyncHandler.js";

export const addJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const findCompany = await companyModel.findOne({ companyHR: userId });

  if (!findCompany) {
    return res.status(400).json({ message: "This HR doesn't have a company" });
  }

  req.body.addedBy = userId;
  const job = await jobModel.create(req.body);

  return res.status(201).json({ job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;

  const findCompany = await companyModel.findOne({ companyHR: userId });

  if (!findCompany) {
    return res.status(400).json({ message: "This HR doesn't have a company" });
  }

  await jobModel.findByIdAndUpdate({ _id }, req.body);

  return res.status(201).json({ message: "Job updated" });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;

  const findCompany = await companyModel.findOne({ companyHR: userId });

  if (!findCompany) {
    return res.status(400).json({ message: "This HR doesn't have a company" });
  }

  await jobModel.findByIdAndDelete({ _id });

  return res.status(201).json({ message: "Job deleted" });
});

export const allJobs = asyncHandler(async (req, res) => {
  const jobs = [];
  const findjobs = await jobModel.find().populate("addedBy");

  await Promise.all(
    findjobs.map(async (job) => {
      const company = await companyModel.findOne({
        companyHR: job.addedBy,
      });

      jobs.push({ company, job });
    })
  );

  res.json({ jobs });
});

export const JobsForSpecificCmpany = asyncHandler(async (req, res) => {
  const companyName = req.query.companyName;

  const findCompany = await companyModel.findOne({ companyName });

  if (!findCompany) {
    return res.status(404).json({ message: "This HR doesn't have a company" });
  }

  const findJobs = await jobModel.find({
    addedBy: findCompany.companyHR,
  });

  if (!findJobs) {
    return res
      .status(404)
      .json({ message: "There are no jobs for this company at this time" });
  }

  res.json({ jobs: findJobs });
});

export const JobsWithFilters = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
  } = req.body;

  const query = {};

  jobTitle && (query.jobTitle = jobTitle);
  jobLocation && (query.jobLocation = jobLocation);
  workingTime && (query.workingTime = workingTime);
  seniorityLevel && (query.seniorityLevel = seniorityLevel);
  technicalSkills && (query.technicalSkills = technicalSkills);

  const findJobs = await jobModel.find(query);

  res.json({ findJobs });
});

export const ApplyToJob = asyncHandler(async (req, res) => {
  applicationModel;

  const _id = req.user._id;

  const findUser = await userModel.findById({ _id });

  if (findUser.role == "company_HR") {
    return res
      .status(400)
      .json({ message: "get out Noooow you are not a user" });
  }

  req.body.userResume = req.file.path;
  req.body.userId = _id;

  const application = await applicationModel.create(req.body);

  res.json({ application });
});
