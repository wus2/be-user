var mysql = require("../../plugins/database/mysql");

const prefix = "skill_tags_";
const table = "skill_tags";

class SkillTags {
  constructor() {
    this.db = mysql;
    this.memCache = new Set();
  }

  // warm up memcache affter restart
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

  addSkills(skills) {
    if (skills.length > 0) {
      this.db
        .addMultiple(table, skills, "tag")
        .then(data => {
          skills.forEach(skill => {
            this.memCache.add(skill[0]);
          });
        })
        .catch(err => {
          console.log("[SkillTags][updateSkill][err]", err);
        });
    }
  }

  getSkills(offset, limit, callback) {
    if (offset < 0 || offset > limit || limit < 0) {
      callback(new Error("offset and limit is error"));
    }

    var skills = [];
    var isMiss = false;
    for (var i = offset; i < offset + limit; i++) {
      var key = prefix + i;
      var skill = this.memCache.get(key);
      if (!skill) {
        isMiss = true; // ensure data return from database
        var sql = `select * from ${table} limit ${offset}, ${limit}`;
        this.db
          .load(sql)
          .then(data => {
            // TODO: this will callback n = limit - offset times
            callback(null, data);
          })
          .catch(err => {
            console.log("[SkillTags][getSkills][err]", err);
            callback(new Error("load from db error"));
          });
      }
      if (!isMiss) {
        skills.push(skill);
      }
    }
    if (!isMiss) {
      callback(null, skills);
    }
  }

  isExists(skill) {
    
  }

  removeSkill(id, callback) {
    if (!id) {
      callback(new Error("undefined skill"));
    }
    this.db
      .delete(table, "id", id)
      .then(data => {
        callback(null, true);
      })
      .catch(err => {
        console.log("[SkillTags][removeSkill][err]", err);
        callback(err);
      });
  }
}

module.exports = SkillTags;
