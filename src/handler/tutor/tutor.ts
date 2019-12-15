import { Request, Response, NextFunction } from "express";
import TutorDB, { Model, ITutorDB } from "../../plugins/database/tutor/tutor";
import SkillDB, { ISkillDB } from "../../plugins/database/skill/skill";

export interface ITutorHandler {
  updateSkills(req: Request, res: Response): void;
  getListTutors(req: Request, res: Response): void;
  updateIntro(req: Request, res: Response): void;
  getProfile(req: Request, res: Response): void;
  getAllSkill(req: Request, res: Response): void;
  filterTutor(req: Request, res: Response): void;
  getListHistory(req: Request, res: Response): void;
  chat(req: Request, res: Response): void;
  renevueStatics(req: Request, res: Response): void;
}

export class TutorHandler implements ITutorHandler {
  tutorDB: ITutorDB;
  skillDB: ISkillDB;
  memCache: Map<string, any>;

  constructor() {
    this.tutorDB = new TutorDB();
    this.skillDB = new SkillDB();
    this.memCache = new Map<string, any>();
  }

  updateSkills(req: Request, res: Response) {
    var skills = req.body.skills;
    if (!skills) {
      return res.json({
        code: -1,
        message: "Field skills is incorrect"
      });
    }
    var payload = res.locals.payload;
    this.tutorDB.updateSkills(payload.id, skills, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  }

  getListTutors(req: Request, res: Response) {
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    if (offset < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    this.tutorDB.getList(offset, limit, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      data.forEach((tutor: any) => {
        if (tutor.skill_tags) {
          tutor.skill_tags = JSON.parse(tutor.skill_tags);
        }
      });
      return res.status(200).json({
        code: 1,
        message: "OK",
        data
      });
    });
  }

  updateIntro(req: Request, res: Response) {
    var desc = req.body.introDesc;
    if (!desc) {
      return res.json({
        code: -1,
        message: "Empty description"
      });
    }
    var payload = res.locals.payload;
    this.tutorDB.updateIntro(payload.id, desc, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    });
  }

  getProfile(req: Request, res: Response) {
    var tutorID = Number(req.params.tutorID);
    if (!tutorID) {
      return res.json({
        code: -1,
        message: "Empty tutorID"
      });
    }
    this.tutorDB.getProfile(tutorID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      if (data[0].skill_tags) {
        data[0].skill_tags = JSON.parse(data[0].skill_tags);
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  }

  getAllSkill(req: Request, res: Response) {
    this.skillDB.warmUp(Infinity, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data
      });
    });
  }

  filterTutor(req: Request, res: Response) {
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    if (offset < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    var district = req.body.district;
    var minPrice = req.body.minPrice;
    var maxPrice = req.body.maxPrice;
    var skill = req.body.skill;
    this.tutorDB.filterTutor(
      district,
      minPrice,
      maxPrice,
      skill,
      offset,
      limit,
      (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: err.toString()
          });
        }
        data.forEach((tutor: any) => {
          if (tutor.skill_tags) {
            tutor.skill_tags = JSON.parse(tutor.skill_tags);
          }
        });
        return res.status(200).json({
          code: 1,
          message: "OK",
          data
        });
      }
    );
  }

  getListHistory(req: Request, res: Response) {}

  chat(req: Request, res: Response) {}

  renevueStatics(req: Request, res: Response) {}
}
