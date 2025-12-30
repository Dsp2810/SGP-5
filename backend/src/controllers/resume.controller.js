const Resume = require("../models/Resume");

exports.uploadResume = async (req, res) => {
  const userId = req.user.id;
  const { resumeUrl } = req.body;

  const lastResume = await Resume.findOne({ userId }).sort({ version: -1 });
  const nextVersion = lastResume ? lastResume.version + 1 : 1;

  const resume = await Resume.create({
    userId,
    version: nextVersion,
    resumeUrl
  });

  res.status(201).json(resume);
};

exports.getResumeHistory = async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id });
  res.json(resumes);
};
