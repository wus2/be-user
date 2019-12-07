var mysql = require("../../plugins/database/mysql");
var SkillTags = require("../admin/update_skill_tags");

const table = "user";

class TutorSkill {
  constructor() {
    this.db = mysql;
    this.skillManage = new SkillTags();
  }

  /**
   * 
   * @param {int} id 
   * @param {array string} skills 
   * @param {function} callback 
   */
  updateSkill(id, skills, callback) {
    // TODO: check skills has or not in db
    var skillStr = JSON.stringify(skills);
    var entity = {
      skill_tags: skillStr
    };
    this.db
      .update(table, id, entity)
      .then(data => {
        callback(data);
      })
      .catch(err => {
        console.log("[update_skills][updateSkill][err]", err);
        callback(err);
      });
  }
}

module.exports = TutorSkill;
