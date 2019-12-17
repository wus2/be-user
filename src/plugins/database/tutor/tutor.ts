import mysql, { IMysql } from "../mysql";
import SkillDB, { ISkillDB } from "../skill/skill";

const Role_Tutor = 1;

export interface TutorModel {
  id?: number;
  username?: string;
  intro_desc?: string;
  skill_tags?: string;
  role?: number;
  num_stars?: number;
  num_rate?: number;
}

export interface ITutorDB {
  getList(offset: number, limit: number, callback: Function): void;
  updateIntro(tutorID: number, desc: string, callback: Function): void;
  getProfile(tutorID: number, callback: Function): void;
  updateSkills(
    tutorID: number,
    skills: Array<string>,
    callback: Function
  ): void;
  filterTutor(
    district: string,
    minPrice: number,
    maxPrice: number,
    skill: string,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  updateRate(tutorID: number, stars: number, callback: Function): void;
}

export default class TutorDB implements ITutorDB {
  db: IMysql;
  userDB: ISkillDB;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.userDB = new SkillDB();
    this.tableName = "user";
  }

  getList(offset: number, limit: number, callback: Function) {
    if (offset < 0 || limit < 0) {
      callback(new Error("Offset or limit is incorrect"));
    }

    var sql = `select * from ${this.tableName} where role = 1 limit ${offset}, ${limit}`;
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

  updateIntro(tutorID: number, desc: string, callback: Function) {
    if (tutorID < 0 || !desc) {
      callback(new Error("Empty desciption or Tutor ID is incorrect"));
    }
    var entity = {
      id: tutorID,
      intro_desc: desc
    } as TutorModel;
    this.db
      .update(this.tableName, "id", entity)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Update database failed"));
      })
      .catch(err => {
        console.log("[TutorDB][updateIntro][err]", err);
        callback(new Error("Update database failed"));
      });
  }

  getProfile(tutorID: number, callback: Function) {
    if (tutorID < 0) {
      return callback(new Error("Empty tutorID"));
    }
    var sql = `select * from ${this.tableName} where id = ${tutorID}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data || data[0].role != Role_Tutor) {
          return callback(new Error("This user is not a tutor"));
        }
        return callback(null, data);
      })
      .catch(err => {
        console.log("[TutorDB][getProfile][err]", err);
        return callback(new Error("Get failed"));
      });
  }

  updateSkills(tutorID: number, skills: Array<string>, callback: Function) {
    skills.forEach((skill: string) => {
      this.userDB.isExists(skill, (ok: boolean) => {
        if (!ok) {
          console.log(
            "[TutorDB][updateSkills][err] skill is not exists",
            skill
          );
          return callback(new Error("Skill is incorrect"));
        }
      });
    });
    var skillStr = JSON.stringify(skills);
    var entity = {
      id: tutorID,
      skill_tags: skillStr
    };
    this.db
      .update(this.tableName, "id", entity)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Update skill failed"));
      })
      .catch(err => {
        console.log("[TutorDB][updateSkill][err]", err);
        return callback(new Error("Update skill failed"));
      });
  }

  filterTutor(
    district: string,
    minPrice: number,
    maxPrice: number,
    skill: string,
    offset: number,
    limit: number,
    callback: Function
  ) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit are incorrect"));
    }
    var sql = `select * from ${this.tableName} where role = 1`;
    if (district) {
      sql += ` and district = '${district}'`;
    }
    if (minPrice && maxPrice && minPrice <= maxPrice) {
      sql += ` and price_per_hour >= ${minPrice} and price_per_hour <= ${maxPrice}`;
    }
    if (skill) {
      sql += ` and skill_tags like '${skill}'`;
    }
    sql += ` limit ${offset}, ${limit}`;

    this.db
      .load(sql)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Filter failed"));
      })
      .catch(err => {
        console.log("[TutorDB][filterTutor][err]", err);
        return callback(new Error("Filter failed"));
      });
  }

  getHistory() {}

  updateRate(tutorID: number, stars: number, callback: Function) {
    if (tutorID < 0 || stars < 0) {
      return callback(new Error("TutorID or stars is incorrect"));
    }
    var sql = `select num_stars, num_rate from ${this.tableName} where id = ${tutorID}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data) {
          return callback(new Error("Get rate failed"));
        }
        var user = data[0] as TutorModel;
        if (!user.num_stars || !user.num_rate) {
          return callback(new Error("Tutor model is incorrect"));
        }
        user.num_stars += stars;
        user.num_rate++;
        this.db
          .update(this.tableName, "id", user)
          .then((data: any) => {
            if (!data) {
              return callback(new Error("Update rate to database failed"));
            }
            return callback();
          })
          .catch((err: Error) => {
            console.log("[TutorDB][updateRate][err]", err);
            return callback(new Error("Update rate to database failed"));
          });
      })
      .catch((err: Error) => {
        console.log("[TutorDB][updateRate][err]", err);
        return callback(new Error("Get rate from database failed"));
      });
  }
}
