var mysql = require("../../plugins/database/mysql");

const prefix = "skill_tags_";
const table = "skill_tags";

class SkillTags {
  constructor() {
    this.db = mysql;
    this.memCache = new Map();
  }

  // warm up memcache affter restart
  warmup() {
    this.db
      .load(`select * from ${table} limit 100`)
      .then(data => {
        if (data) {
          data.forEach(skill => {
            var key = prefix + skill.id;
            this.memCache.set(key, skill.tag);
          });
        }
      })
      .catch(err => {
        console.log("[SkillTags][warmup][err]", err);
      });
  }

  addSkills(skills) {
    console.log("Update Skill tags");
    if (skills.length > 0) {
      this.db
        .addMultiple(table, skills, "tag")
        .then(data => {
          var counter = data.insertId;
          skills.forEach(skill => {
            var key = prefix + counter;
            counter++;
            this.memCache.set(key, skill[0]);
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

  isExists(skill, callback) {
    var sql = `select tag from ${table} where tag = ${skill}`;
    this.db
      .load(sql)
      .then(data => {
        if (data) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      })
      .catch(err => {
        console.log("[SkillTags][isExists][err]", err);
        callback(null, err);
      });
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
