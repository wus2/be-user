var SkillTags = require("./skills");
var ManageUser = require("./users");

const skill = new SkillTags();
const user = new ManageUser();

const role = 2110;

module.exports = {
  getSkills: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    skill.getSkills(req.params.offset, req.params.limit, (err, data) => {
      if (err) {
        return res.json({
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
  getSkill: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var id = req.params.id;
    if (!id) {
      return res.json({
        code: -1,
        message: "ID is incorrect"
      });
    }
    skill.getSkill(id, (err, data) => {
      if (err || !data) {
        return res.json({
          code: -1,
          message: err
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  },
  addSkill: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var skillStr = req.body.skill;
    if (!skillStr) {
      return res.json({
        code: -1,
        message: "Skill is empty!"
      });
    }
    skill.addSkill(skillStr, (err, data) => {
      if (err || !data) {
        return res.json({
          code: -1,
          message: err
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  },
  updateSkill: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var id = req.body.skillID;
    var skillStr = req.body.skill;
    if (!id || !skillStr) {
      return res.json({
        code: -1,
        message: "Skill ID or skill name is empty"
      });
    }
    skill.updateSkill(id, skillStr, (err, data) => {
      if (err || !data) {
        return res.json({
          code: -1,
          message: !data ? "Update failed" : err
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  },
  removeSkill: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var skillID = req.params.id;
    if (!skillID) {
      return res.json({
        code: -1,
        message: "Empty skill ID"
      });
    }
    skill.removeSkill(skillID, (err, ok) => {
      if (err || !ok) {
        return res.json({
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
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var offset = req.params.offset;
    var limit = req.params.limit;
    if (!offset || !limit) {
      return res.json({
        code: 1,
        message: "Offset or limit is incorrect"
      });
    }
    user.getListUser(offset, limit, (err, data) => {
      if (err || !data) {
        return res.json({
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
  getUserProfile: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthenticated"
      });
    }
    if (payload.role != role) {
      return res.json({
        code: -1,
        message: "Admin only"
      });
    }
    var id = req.params.id;
    if (!id) {
      return res.json({
        code: 1,
        message: "User ID is incorrect"
      });
    }
    user.getUserProfile(id, (err, data) => {
      if (err || !data) {
        return res.json({
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
