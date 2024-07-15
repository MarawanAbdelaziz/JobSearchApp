import companyModel from "../../../../DB/models/companyModel.js";
import jobModel from "../../../../DB/models/jobModel.js";
import userModel from "../../../../DB/models/uesrModel.js";

export const addCompany = async (req, res) => {
  try {
    const _id = req.user._id;

    const findCompanyName = await companyModel.findOne({
      companyName: req.body.companyName,
    });

    const findCompanyEmail = await companyModel.findOne({
      companyEmail: req.body.companyEmail,
    });

    if (findCompanyName || findCompanyEmail) {
      return res
        .status(400)
        .json({ message: "Company name or company Email already exist" });
    }

    if (req.body.numberOfEmployees < 11 || req.body.numberOfEmployees > 20) {
      return res
        .status(400)
        .json({ message: "Number of employees Should between 11 and 20" });
    }
    req.body.companyHR = _id;

    const company = await companyModel.create(req.body);

    res.status(201).json({ company: company });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const _id = req.params.id;

    const findCompany = await companyModel.findById({ _id });

    if (!findCompany) {
      return res.status(400).json({ message: "Company not exist" });
    }

    if (userId.toString() != findCompany.companyHR.toString()) {
      return res.status(400).json({ message: "you are not the owner" });
    }

    if (
      req.body.companyName.toLowerCase() == findCompany.companyName ||
      req.body.companyEmail.toLowerCase() == findCompany.companyEmail
    ) {
      return res
        .status(400)
        .json({ message: "Company name or company Email already exist" });
    }

    if (req.body.numberOfEmployees < 11 || req.body.numberOfEmployees > 20) {
      return res
        .status(400)
        .json({ message: "Number of employees Should between 11 and 20" });
    }

    await companyModel.findByIdAndUpdate({ _id }, req.body);

    res.json({ message: "Company updated" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    const _id = req.params.id;

    const findCompany = await companyModel.findById({ _id });

    if (!findCompany) {
      return res.status(400).json({ message: "Company not exist" });
    }

    if (userId.toString() != findCompany.companyHR.toString()) {
      return res.status(400).json({ message: "you are not the owner" });
    }

    await companyModel.findByIdAndDelete({ _id });

    return res.json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const _id = req.params.id;

    const findCompany = await companyModel.findById({ _id });

    if (!findCompany) {
      return res.status(400).json({ message: "Company not exist" });
    }

    const findjobs = await jobModel.find({ addedBy: findCompany.companyHR });

    if (!findjobs) {
      return res
        .status(400)
        .json({ message: "this company doesn't have any jobs" });
    }

    res.json({ company: findCompany, jobs: findjobs });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const searchByCompanyName = async (req, res) => {
  try {
    const companyName = req.body.companyName;

    const findCompany = await companyModel.findOne({ companyName });

    if (!findCompany) {
      return res.status(400).json({ message: "Company not exist" });
    }

    res.json({ findCompany });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Get all applications for specific Job
export const GAAFSJ = (req, res) => {};
