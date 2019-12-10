var Tutor = require("./tutors");

const tutor = new Tutor();

module.exports = {
  updateSkills: (req, res, payload) => {
    var skills = req.body.skills;
    if (!skills) {
      return res.json({
        code: -1,
        message: "Field skills is incorrect"
      });
    }
    tutor.updateSkills(payload.id, skills, (err, data) => {
      if (err || !data) {
        return res.json({
          code: -1,
          message: "Update Skills failed"
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  },
  getList: (req, res) => {
    var offset = req.params.offset;
    var limit = req.params.limit;
    if (!offset || !limit) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    tutor.getList(offset, limit, (err, data) => {
      console.log(data);
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
  updateIntro: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "Authen failed"
      });
    }
    if (payload.role != 1) {
      return res.json({
        code: -1,
        message: "Role only for tutor"
      });
    }
    var desc = req.body.introDesc;
    if (!desc) {
      return res.json({
        code: -1,
        message: "Empty description"
      });
    }
    tutor.updateIntro(payload.id, desc, (err, data) => {
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
  getProfile: (req, res) => {
    var tutorID = req.params.tutorID;
    if (!tutorID) {
      return res.json({
        code: -1,
        message: "Empty tutorID"
      });
    }
    tutor.getProfile(tutorID, (err, data) => {
      if (err || !data) {
        console.log("[getProfile][err]", err);
        return res.json({
          code: -1,
          message: "Get failed"
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
