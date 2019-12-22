import { Request, Response, NextFunction } from "express";
import TutorDB, {
  TutorModel,
  ITutorDB
} from "../../plugins/database/tutor/tutor";
import SkillDB, { ISkillDB } from "../../plugins/database/skill/skill";
import {
  IContractDB,
  ContractDB,
  ContractModel,
  ContractStatus
} from "../../plugins/database/contract/contract";

const Pagination = 12;

export interface ITutorHandler {
  updateSkills(req: Request, res: Response): void;
  getListTutors(req: Request, res: Response): void;
  updateIntro(req: Request, res: Response): void;
  getProfile(req: Request, res: Response): void;
  getAllSkill(req: Request, res: Response): void;
  filterTutor(req: Request, res: Response): void;
  getListContracttHistory(req: Request, res: Response): void;
  getDetailContract(req: Request, res: Response): void;
  renevueStatics(req: Request, res: Response): void;
  approveContract(req: Request, res: Response): void;
}

export class TutorHandler implements ITutorHandler {
  tutorDB: ITutorDB;
  skillDB: ISkillDB;
  contractDB: IContractDB;
  memCache: Map<string, any>;

  constructor() {
    this.tutorDB = new TutorDB();
    this.skillDB = new SkillDB();
    this.contractDB = new ContractDB();
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
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    var offset = page * Pagination;
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
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    var offset = page * Pagination;
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

  getListContracttHistory(req: Request, res: Response) {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is invalid"
      });
    }
    var page = Number(req.params.page);
    var limit = Number(req.params.limit);
    if (page < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
    var offset = page * Pagination;
    this.contractDB.getListContract(
      payload.id,
      payload.role,
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

  renevueStatics(req: Request, res: Response) {}

  getDetailContract(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    this.contractDB.getContract(contractID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is empty"
        });
      }
      var contract = data[0] as ContractModel;
      if (contract.tutor_id != payload.id) {
        return res.json({
          code: -1,
          message: "Permission denied"
        });
      }
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  }

  approveContract(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    this.contractDB.getContract(contractID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      var contract = data[0] as ContractModel;
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is undefined"
        });
      }
      if (contract.tutor_id && payload.id != contract.tutor_id) {
        return res.json({
          code: -1,
          message: "This is not your contract"
        });
      }
      var now = ~~(new Date().getTime() / 1000);
      console.log("[TutorHandler][approveContract][now]", now);
      if (contract.create_time && now > contract.create_time + 864e5) {
        // 864e5 is 2 date in timestamp
        console.log(
          "[TutorHandler][approveContract][expired time]",
          contract.create_time + 864e5
        );
        return res.json({
          code: -1,
          message: "Contract is expired"
        });
      }
      console.log("[TutorHandler][approveContract][contract]", contract);
      contract.status = ContractStatus.Approved;
      this.contractDB.updateContract(contract, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: err.toString()
          });
        }
        // TODO: notify to tutee and set to history
        return res.status(200).json({
          code: 1,
          message: "OK"
        });
      });
    });
  }
}
