var SkillTags = require("./skills");
var ManageUser = require("./users");

const skill = new SkillTags();
const user = new ManageUser();

const role = 2110;

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
  addSkill: (req, res) => {
    skill.addSkills(req.params.skills, (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          code: -1,
          message: !data ? "Add failed" : err
        });
      }
      return res.status(400).json({
        code: 1,
        message: "OK"
      });
    });
  },
  updateSkill: (req, res) => {
    skill.updateSkill(req.body.id, req.body.skill, (err, data) => {
      if (err || !data) {
        return res.status(400).json({
          code: -1,
          message: !data ? "Update failed" : err
        });
      }
      return res.status(400).json({
        code: 1,
        message: "OK"
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
  },
  getUsers: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.status(400).json({
        code: -1,
        message: "Admin only"
      });
    }
    var offset = req.params.offset;
    var limit = req.params.limit;
    if (!offset || !limit) {
      return res.status(400).json({
        code: 1,
        message: "Offset or limit is incorrect"
      });
    }
    user.getListUser(offset, limit, (err, data) => {
      if (err || !data) {
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
  }
};
