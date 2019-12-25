import { Request, Response, NextFunction } from "express";
import UserDB, {
  IUserDB,
  UserModel,
  AccountStatus
} from "../../plugins/database/user/user";
import SkillDB, { ISkillDB } from "../../plugins/database/skill/skill";
import { Model } from "../../plugins/database/skill/skill";
import {
  IComplainDB,
  ComplainDB
} from "../../plugins/database/complain/complain";
import {
  IContractDB,
  ContractDB,
  ContractModel
} from "../../plugins/database/contract/contract";

const Pagination = 12;

export interface IAdminHandler {
  getListUser(req: Request, res: Response): void;
  getUserProfile(req: Request, res: Response): void;
  getListSkill(req: Request, res: Response): void;
  getSkill(req: Request, res: Response): void;
  addSkill(req: Request, res: Response): void;
  updateSkill(req: Request, res: Response): void;
  removeSkill(req: Request, res: Response): void;
  lockUser(req: Request, res: Response): void;
  unlockUser(req: Request, res: Response): void;
  processComplain(req: Request, res: Response): void;
  getUserMessageHistory(req: Request, res: Response): void;
  getListComplain(req: Request, res: Response): void;
  getListContract(req: Request, res: Response): void;
  updateContract(req: Request, res: Response): void;
  revenue(req: Request, res: Response): void;
}

export class AdminHandler implements IAdminHandler {
  userDB: IUserDB;
  skillDB: ISkillDB;
  complainDB: IComplainDB;
  contractDB: IContractDB;

  constructor() {
    this.userDB = new UserDB();
    this.skillDB = new SkillDB();
    this.complainDB = new ComplainDB();
    this.contractDB = new ContractDB();
  }

  getListUser(req: Request, res: Response) {
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
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

  getListSkill(req: Request, res: Response) {
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
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
    } as Model;
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

  lockUser(req: Request, res: Response) {
    var userID = Number(req.params.userID);
    if (userID < 0) {
      return res.json({
        cpde: -1,
        message: "User ID is incorrect"
      });
    }
    var entity = {
      id: userID,
      account_status: AccountStatus.Block
    } as UserModel;
    this.userDB.updateUser(entity, (err: Error, data: any) => {
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

  unlockUser(req: Request, res: Response) {
    var userID = Number(req.params.userID);
    if (userID < 0) {
      return res.json({
        cpde: -1,
        message: "User ID is incorrect"
      });
    }
    var entity = {
      id: userID,
      account_status: AccountStatus.Active
    } as UserModel;
    this.userDB.updateUser(entity, (err: Error, data: any) => {
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

  processComplain(req: Request, res: Response) {}

  getUserMessageHistory(req: Request, res: Response) {}

  getListComplain(req: Request, res: Response) {
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    this.complainDB.getListComplain(offset, limit, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      return res.status(200).json({
        code: -1,
        message: "OK",
        data
      });
    });
  }

  getListContract(req: Request, res: Response) {
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    this.contractDB.getListUserContract(
      offset,
      limit,
      (err: Error, data: any) => {
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
      }
    );
  }

  updateContract(req: Request, res: Response) {
    var contractID = Number(req.body.contractID);
    if (!contractID || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    var entity = {
      cid: contractID,
      start_time: req.body.start_time,
      status: req.body.status,
      comment: req.body.comment
    } as ContractModel;
    if (!entity) {
      return res.json({
        code: -1,
        message: "Contract model is incorrect"
      });
    }
    this.contractDB.updateContract(entity, (err: Error, data: any) => {
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

  revenue(req: Request, res: Response) {
    var tutorID = Number(req.query.tutor_id);
    if (!tutorID || tutorID < 0) {
      return res.json({
        code: -1,
        message: "Tutor ID is incorrect"
      });
    }
    var start = Number(req.query.start_time);
    var end = Number(req.query.end_time);
    if (!start || !end || start < 0 || end < 0 || start > end) {
      return res.json({
        code: -1,
        message: "Start time or end time is incorrect"
      });
    }

    this.contractDB.reveneuForTutor(
      tutorID,
      start,
      end,
      (err: Error, data: any) => {
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
      }
    );
  }
}
