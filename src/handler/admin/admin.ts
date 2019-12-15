import { Request, Response, NextFunction } from "express";
import UserDB, { IUserDB } from "../../plugins/database/user/user";
import SkillDB, { ISkillDB } from "../../plugins/database/skill/skill";
import { Model } from "../../plugins/database/skill/skill";

export interface IAdminHandler {
  getListUser(req: Request, res: Response): void;
  getUserProfile(req: Request, res: Response): void;
  getListSkill(req: Request, res: Response): void;
  getSkill(req: Request, res: Response): void;
  addSkill(req: Request, res: Response): void;
  updateSkill(req: Request, res: Response): void;
  removeSkill(req: Request, res: Response): void;
}

export class AdminHandler implements IAdminHandler {
  userDB: IUserDB;
  skillDB: ISkillDB;

  constructor() {
    this.userDB = new UserDB();
    this.skillDB = new SkillDB();
  }

  getListUser(req: Request, res: Response) {
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    if (offset < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    this.userDB.getListUsers(offset, limit, (err: Error, data: any) => {
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

  getUserProfile(req: Request, res: Response) {
    var userID = Number(req.params.userID);
    if (!userID || userID < 0) {
      return res.json({
        code: -1,
        message: "UserID is incorrect"
      });
    }
    this.userDB.getByID(userID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  }

  getListSkill(req: Request, res: Response) {
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    if (offset < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    this.skillDB.getSkills(offset, limit, (err: Error, data: any) => {
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

  getSkill(req: Request, res: Response) {
    var skillID = Number(req.params.skillID);
    if (!skillID || skillID < 0) {
      return res.json({
        code: -1,
        message: "Skill ID is incorrect"
      });
    }
    this.skillDB.getSkill(skillID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString().toString()
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  }

  addSkill(req: Request, res: Response) {
    var skillStr = req.body.skill;
    if (!skillStr) {
      return res.json({
        code: -1,
        message: "Skill is empty!"
      });
    }
    var entity = {
      tag: skillStr
    } as Model
    this.skillDB.addSkill(entity, (err: Error, data: any) => {
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

  updateSkill(req: Request, res: Response) {
    var skillID = Number(req.body.skillID);
    if (!skillID || skillID < 0) {
      return res.json({
        code: -1,
        message: "Skill ID is incorrect"
      });
    }
    var entity = {
      id: skillID,
      tag: req.body.skill,
      desc: req.body.desc
    } as Model;
    if (!entity) {
      return res.json({
        code: -1,
        message: "Skill ID or skill name is empty"
      });
    }
    this.skillDB.updateSkill(skillID, entity, (err: Error, data: any) => {
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

  removeSkill(req: Request, res: Response) {
    var skillID = Number(req.params.skillID);
    if (!skillID || skillID < 0) {
      return res.json({
        code: -1,
        message: "Empty skill ID"
      });
    }
    this.skillDB.removeSkill(skillID, (err: Error, ok: boolean) => {
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
  }

  lockOrUnlockUser(req: Request, res: Response) {}
}
