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
import { SocketServer } from "../../plugins/socket/socket";
import {
  INotificationDB,
  NotificationDB,
  NotificationModel
} from "../../plugins/database/notification/notification";
import { GetApproveContractDesc } from "../../plugins/sse/notification";

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
  getRateResults(req: Request, res: Response): void;
  getTopTutor(req: Request, res: Response): void;
  revenue(req: Request, res: Response): void;
}

export class TutorHandler implements ITutorHandler {
  tutorDB: ITutorDB;
  skillDB: ISkillDB;
  contractDB: IContractDB;
  notiDB: INotificationDB;
  memCache: Map<string, any>;
  socket: any;

  constructor() {
    this.tutorDB = new TutorDB();
    this.skillDB = new SkillDB();
    this.contractDB = new ContractDB();
    this.notiDB = new NotificationDB();
    this.memCache = new Map<string, any>();

    SocketServer.Instance()
      .then(socket => {
        this.socket = socket as SocketServer;
        console.log("[TutorHandler]Socket get instance");
      })
      .catch(err => {
        console.log(err);
      });
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
    if (page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
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
    var page = Number(req.query.page);
    var limit = Number(req.query.limit);
    if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    var district = req.query.district;
    var minPrice = req.query.minPrice;
    var maxPrice = req.query.maxPrice;
    var skill = req.query.skill;
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
    if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    this.contractDB.getListContractWithUserInfo(
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
        data.forEach((element: any) => {
          if (element.skill_tags) {
            element.skill_tags = JSON.parse(element.skill_tags);
          }
          console.log(element.skill_tags);
        });
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
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is empty"
      });
    }
    this.contractDB.getContractViaRole(
      contractID,
      payload.role,
      (err: Error, data: any) => {
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
        if (data[0].skill_tags) {
          data[0].skill_tags = JSON.parse(data[0].skill_tags);
        }
        return res.status(200).json({
          code: 1,
          message: "OK",
          data: data[0]
        });
      }
    );
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
        if (!contract.tutor_id) {
          return res.json({
            code: -1,
            message: "Tutor of contract is empty"
          });
        }
        this.tutorDB.getProfile(contract.tutor_id, (err: Error, data: any) => {
          if (err) {
            return res.json({
              code: -1,
              message: "Get Tutor profile failed"
            });
          }
          var tutor = data[0] as TutorModel;
          if (!tutor) {
            return res.json({
              code: -1,
              message: "Tutor model is not correct"
            });
          }
          var entity = {
            user_id: contract.tutee_id,
            from_name: tutor.name,
            contract_id: contract.cid,
            description: GetApproveContractDesc(tutor.name)
          } as NotificationModel;

          this.notiDB.setNotification(entity, (err: Error, data: any) => {
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
        });
      });
    });
  }

  getRateResults(req: Request, res: Response) {
    var tutorID = Number(req.query.tutor_id);
    if (!tutorID || tutorID < 0) {
      return res.json({
        code: -1,
        message: "Tutor ID is incorrect"
      });
    }
    var page = Number(req.query.page);
    var limit = Number(req.query.limit);
    if (!page || !limit || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    this.contractDB.getRateResultInContract(
      tutorID,
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

  getTopTutor(req: Request, res: Response) {
    var page = Number(req.query.page);
    var limit = Number(req.query.limit);
    if (!page || !limit || page <= 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Page or limit is incorrect"
      });
    }
    var offset = (page - 1) * Pagination;
    this.tutorDB.getToptutor(offset, limit, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }
      data.forEach((element: any) => {
        if (element.skill_tags) {
          element.skill_tags = JSON.parse(element.skill_tags);
        }
        console.log(element.skill_tags);
      });
      return res.status(200).json({
        code: 1,
        message: "OK",
        data
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
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is empty"
      });
    }
    if (tutorID != payload.id) {
      return res.json({
        code: -1,
        message: "Permission denied"
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
