var SkillTags = require("./update_skill_tags");

const skill = new SkillTags();

module.exports = {
  getSkills: (req, res) => {
    skill.getSkills(req.params.offset, req.params.limit, (err, data) => {
      if (err) {
        return res.status(400).json({
          code: -1,
          message: err
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data
      });
    });
  },
  removeSkill: (req, res) => {
    skill.removeSkill(req.params.id, (err, ok) => {
      if (err || !ok) {
        return res.status(400).json({
          code: -1,
          message: "Remove failed"
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  }
};
