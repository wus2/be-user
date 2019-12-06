var TutorSkill = require("./update_skills");

const skill = new TutorSkill();

module.exports = {
  updateSkills: (req, res, payload) => {
    var skills = req.body.skills;
    if (!skills) {
      return res.status(400).json({
        code: -1,
        message: "Field skills is incorrect"
      });
    }
    skill.updateSkills(payload.id, skills, (err, data) => {
      if (err || data < 0) {
        return res.status(400).json({
          code: -1,
          message: "Update Skills failed"
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  }
};
