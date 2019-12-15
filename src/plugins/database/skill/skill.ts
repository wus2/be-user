import mysql, { IMysql } from "../mysql";

export interface Model {
  id?: number;
  tag?: string;
  desc?: string;
  image?: string;
}

export interface ISkillDB {
  warmUp(limit: number, callback: Function): void;
  addMultipleSkill(skills: Array<string>, callback: Function): void;
  addSkill(entity: Model, callback: Function): void;
  getSkill(skillID: number, callback: Function): void;
  getSkills(offset: number, limit: number, callback: Function): void;
  updateSkill(skillID: number, entity: Model, callback: Function): void;
  isExists(tag: string, callback: Function): void;
  removeSkill(skillID: number, callback: Function): void;
}

export default class SkillDB implements ISkillDB {
  db: IMysql;
  tableName: string;

  constructor() {
    this.db = mysql;
    this.tableName = "skill_tags";
  }

  warmUp(limit: number, callback: Function) {
    var sql = `select * from ${this.tableName}`;
    if (limit != Infinity) {
      sql += ` limit ${limit}`;
    }
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Skill is empty"));
      })
      .catch(err => {
        console.log("[SkillDB][warmup][err]", err);
        return callback(new Error("Cannot get skill"));
      });
  }

  addMultipleSkill(skills: Array<string>, callback: Function) {
    if (skills.length > 0) {
      this.db
        .addMultiple(this.tableName, skills, "tag")
        .then((data: any) => {
          if (data) {
            callback(null, data);
          }
          callback(new Error("Add failed"));
        })
        .catch((err: any) => {
          console.log("[SkillTags][updateSkill][err]", err);
          callback(new Error("Add failed"));
        });
    }
  }

  addSkill(entity: Model, callback: Function) {
    if (!entity) {
      return callback(new Error("Skill is empty!"));
    }
    this.db
      .add(this.tableName, entity)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Add skill failed"));
      })
      .catch(err => {
        console.log("[SkillDB][addSkill][err]", err);
        return callback(new Error("Add skill failed"));
      });
  }

  getSkill(skillID: number, callback: Function) {
    if (skillID < 0) {
      return callback(new Error("ID is incorrect"));
    }

    var sql = `select * from ${this.tableName} where id = ${skillID}`;
    this.db
      .load(sql)
      .then(data => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Skill is empty"));
      })
      .catch(err => {
        console.log("[SkillDB][getSkills][err]", err);
        return callback(new Error("Load from db error"));
      });
  }

  getSkills(offset: number, limit: number, callback: Function) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("offset and limit is error"));
    }

    var sql = `select * from ${this.tableName} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then(data => {
        return callback(null, data);
      })
      .catch(err => {
        console.log("[SkillDB][getSkills][err]", err);
        return callback(new Error("load from db error"));
      });
  }

  updateSkill(skillID: number, entity: Model, callback: Function) {
    if (!entity || !skillID) {
      return callback(new Error("Empty skill"));
    }
    this.db
      .update(this.tableName, "id", entity)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Update failed"));
      })
      .catch(err => {
        console.log("[SkillDB][updateSkill][err]", err);
        return callback(new Error("Update failed"));
      });
  }

  isExists(tag: string, callback: Function) {
    if (!tag) {
      return callback(false);
    }

    var sql = `select * from ${this.tableName} where tag = '${tag}'`;
    this.db
      .load(sql)
      .then(data => {
        if (data) {
          return callback(true);
        }
        return callback(false);
      })
      .catch(err => {
        console.log("[SkillDB][isExists][err]", err);
        return callback(false);
      });
  }

  removeSkill(skillID: number, callback: Function) {
    if (!skillID || skillID < 0) {
      return callback(new Error("undefined skill"));
    }
    this.db
      .delete(this.tableName, "id", skillID)
      .then((data: any) => {
        var affectedRow = Number(data);
        if (affectedRow < 1) {
          return callback(null, false);
        }
        return callback(null, true);
      })
      .catch(err => {
        console.log("[SkillDB][removeSkill][err]", err);
        return callback(err);
      });
  }
}
