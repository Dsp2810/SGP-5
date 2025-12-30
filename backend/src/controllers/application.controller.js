const Application = require("../models/Application");

exports.createApplication = async (req, res) => {
  const { company, role, resumeVersion } = req.body;

  const application = await Application.create({
    userId: req.user.id,
    company,
    role,
    resumeVersion
  });

  res.status(201).json(application);
};

exports.getApplications = async (req, res) => {
  const applications = await Application.find({ userId: req.user.id });
  res.json(applications);
};
