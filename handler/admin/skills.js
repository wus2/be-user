var mysql = require("../../plugins/database/mysql");

const prefix = "skill_tags_";
const table = "skill_tags";
const userTable = "user";

class SkillTags {
  constructor() {
    this.db = mysql;
    this.memCache = new Set();
  }

  /**
   * warm up memcache affter restart
   */
  warmup() {
    this.db
      .load(`select * from ${table} limit 100`)
      .then(data => {
        if (data) {
          data.forEach(skill => {
            this.memCache.add(skill.tag);
          });
        }
      })
      .catch(err => {
        console.log("[SkillTags][warmup][err]", err);
      });
  }

  /**
   *
   * @param {array string} skills
   */
  addSkills(skills, callback) {
    if (skills.length > 0) {
      this.db
        .addMultiple(table, skills, "tag")
        .then(data => {
          if (data) {
            skills.forEach(skill => {
              this.memCache.add(skill[0]);
            });
            callback(null, data);
          }
          callback(new Error("Add failed"));
        })
        .catch(err => {
          console.log("[SkillTags][updateSkill][err]", err);
          callback(new Error("Add failed"));
        });
    }
  }

  addSkill(skill, callback) {
    if (!skill) {
      return callback(new Error("Skill is empty!"));
    }
    var entity = {
      tag: skill
    };
    this.db
      .add(table, entity)
      .then(data => {
        if (data) {
          this.memCache.add(data);
        }
        return callback(null, data);
      })
      .catch(err => {
        console.log("[SkillTags][updateSkill][err]", err);
        return callback(new Error("Add failed"));
      });
  }

  /**
   *
   * @param {int} offset
   * @param {int} limit
   * @param {function} callback
   */
  getSkills(offset, limit, callback) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("offset and limit is error"));
    }

    var skills = [];
    var isMiss = false;
    var isCallback = false
    for (var i = offset; i < offset + limit; i++) {
      // TODO: get in cache first
      var skill
      if (!skill) {
        isMiss = true; // ensure data return from database
        var sql = `select * from ${table} limit ${offset}, ${limit}`;
        this.db
          .load(sql)
          .then(data => {
            // TODO: this will callback n = limit - offset times
            // this temporary solution to resolve this issue
            if (isCallback) {
              return
            }
            isCallback = true
            return callback(null, data);
          })
          .catch(err => {
            console.log("[SkillTags][getSkills][err]", err);
            return callback(new Error("load from db error"));
          });
      }
      if (!isMiss) {
        skills.push(skill);
      }
    }
    if (!isMiss) {
      return callback(null, skills);
    }
  }

  /**
   *
   * @param {int} id
   * @param {function} callback
   */
  getSkill(id, callback) {
    if (id < 0) {
      return callback(new Error("ID is incorrect"));
    }

    var sql = `select * from ${table} where id = ${id}`;
    this.db
      .load(sql)
      .then(data => {
        return callback(null, data);
      })
      .catch(err => {
        console.log("[SkillTags][getSkills][err]", err);
        return callback(new Error("load from db error"));
      });
  }

  /**
   *
   * @param {int} id
   * @param {string} skill
   * @param {function} callback
   */
  updateSkill(id, skill, callback) {
    if (!skill || !id) {
      return callback(new Error("Empty skill"));
    }
    var entity = {
      id: id,
      tag: skill
    };
    this.db
      .update(table, "id", entity)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Update failed"));
      })
      .catch(err => {
        console.log("[SkillTags][updateSkill][err]", err);
        return callback(new Error("Update failed"));
      });
  }

  isExists(skill, callback) {
    if (!skill) {
      callback(false);
    }
    if (this.memCache.has(skill)) {
      callback(true);
    } else {
      var sql = `select * from ${table} where tag = '${skill}'`;
      this.db
        .load(sql)
        .then(data => {
          if (data) {
            callback(true);
          }
          callback(false);
        })
        .catch(err => {
          console.log("[TutorSkill][isExists][err]", err);
          callback(false);
        });
    }
  }

  /**
   *
   * @param {int} id
   * @param {function} callback
   */
  removeSkill(id, callback) {
    if (!id) {
      return callback(new Error("undefined skill"));
    }
    this.db
      .delete(table, "id", id)
      .then(data => {
        if (data < 1) {
          return callback(null, false);
        }
        return callback(null, true);
      })
      .catch(err => {
        console.log("[SkillTags][removeSkill][err]", err);
        return callback(err);
      });
  }
}

module.exports = SkillTags;
