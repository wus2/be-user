var mysql = require("../../plugins/database/mysql");
var SkillTags = require("../admin/skills");

const table = "user";

class Tutor {
  constructor() {
    this.db = mysql;
    this.skill = new SkillTags();
  }

  /**
   *
   * @param {int} offset
   * @param {int} limit
   */
  getList(offset, limit, callback) {
    if (offset < 0 || limit < 0) {
      callback(new Error("Offset or limit is incorrect"));
    }

    var sql = `select * from ${table} where role = 1 limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        console.log("[Tutor][getList][err]", err);
        callback(new Error("Get database failed"));
      });
  }

  /**
   *
   * @param {int} uid
   * @param {string} desc
   * @param {function} callback
   */
  updateIntro(uid, desc, callback) {
    if (!desc) {
      callback(new Error("Empty desciption"));
    }
    var entity = {
      id: uid,
      intro_desc: desc
    };
    this.db
      .update(table, "id", entity)
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        console.log("[Tutor][updateIntro][err]", err);
        callback(new Error("Update database failed"));
      });
  }

  /**
   *
   * @param {int} id
   * @param {function} callback
   */
  getProfile(id, callback) {
    if (!id) {
      return callback(new Error("Empty tutorID"));
    }
    var sql = `select * from ${table} where id = ${id}`;
    this.db
      .load(sql)
      .then(data => {
        if (data[0].role != 1) {
          return callback(new Error("This ID is not a tutor"));
        }
        return callback(null, data[0]);
      })
      .catch(err => {
        console.log("[Tutor][getProfile][err]", err);
        return callback(new Error("Get failed"));
      });
  }

  /**
   *
   * @param {int} tutorID
   * @param {array string} skills
   * @param {function} callback
   */
  updateSkills(tutorID, skills, callback) {
    skills.forEach(skill => {
      this.skill.isExists(skill, ok => {
        if (!ok) {
          callback(new Error("Skill is incorrect", skill));
        }
      });
    });
    var skillStr = JSON.stringify(skills);
    var entity = {
      id: tutorID,
      skill_tags: skillStr
    };
    this.db
      .update(table, "id", entity)
      .then(data => {
        callback(data);
      })
      .catch(err => {
        console.log("[update_skills][updateSkill][err]", err);
        callback(err);
      });
  }

  filterTutor(district, minPrice, maxPrice, skill, offset, limit, callback) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit are incorrect"));
    }
    var sql = `select * from ${table} where role = 1`;
    if (!district) {
      sql += ` and district = ${district}`;
    }
    if (
      !minPrice &&
      !maxPrice &&
      Number.isInteger(minPrice) &&
      Number.isInteger(maxPrice) &&
      minPrice <= maxPrice
    ) {
      sql += ` and price_per_hour >= ${minPrice} and price_per_hour <= ${maxPrice}`;
    }
    if (!skill) {
      sql += ` and skill_tags like ${skill}`;
    }
    sql += ` limit ${offset}, ${limit}`;

    this.db
      .load(sql)
      .then(data => {
        return callback(null, data);
      })
      .catch(err => {
        console.log("[filterTutor][err]", err);
        return callback(new Error("Get failed"));
      });
  }
}

module.exports = Tutor;
