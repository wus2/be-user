import { Request, Response, NextFunction } from "express";
import {
  IContractDB,
  ContractDB,
  ContractModel,
  ContractStatus
} from "../../plugins/database/contract/contract";
import TutorDB, { ITutorDB } from "../../plugins/database/tutor/tutor";
import { SSE } from "../../plugins/sse/sse";
import {
  NotifyModel,
  GetContractDescription,
  ContractTopic,
  RateTopic,
  GetRateDescription
} from "../../plugins/sse/notification";
import UserDB, { IUserDB, UserModel } from "../../plugins/database/user/user";
import { SocketServer } from "../../plugins/socket/socket";
import {
  IComplainDB,
  ComplainDB,
  ComplainModel
} from "../../plugins/database/complain/complain";
import {
  NotificationModel,
  INotificationDB,
  NotificationDB
} from "../../plugins/database/notification/notification";

const Pagination = 12;

export interface ITuteeHandler {
  rentTutor(req: Request, res: Response): void;
  getListContractHistory(req: Request, res: Response): void;
  getDetailContractHistory(req: Request, res: Response): void;
  evaluateRateForTutor(req: Request, res: Response): void;
  evaluateCommentForTutor(req: Request, res: Response): void;
  evaluateForTutor(req: Request, res: Response): void;
  payContract(req: Request, res: Response): void;
  complainContract(req: Request, res: Response): void;
}

export class TuteeHandler implements ITuteeHandler {
  contractDB: IContractDB;
  tutorDB: ITutorDB;
  userDB: IUserDB;
  complainDB: IComplainDB;
  notiDB: INotificationDB;
  socket: any;

  constructor() {
    this.contractDB = new ContractDB();
    this.tutorDB = new TutorDB();
    this.userDB = new UserDB();
    this.complainDB = new ComplainDB();
    this.notiDB = new NotificationDB();

    SocketServer.Instance()
      .then(socket => {
        this.socket = socket as SocketServer;
        console.log("[TuteeHandler]Socket get instance");
      })
      .catch(err => {
        console.log(err);
      });
  }

  rentTutor(req: Request, res: Response) {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is undefined"
      });
    }
    var startTime = ~~(Date.parse(req.body.startTime) / 1000);
    if (!startTime) {
      return res.json({
        code: -1,
        message: "Format start time is not correct"
      });
    }
    var tutorID = Number(req.body.tutorID);
    var rentTime = Number(req.body.rentTime);
    var rentPrice = Number(req.body.rentPrice);
    if (tutorID < 0 || rentTime < 0 || rentPrice < 0) {
      return res.json({
        code: -1,
        message: "Some fields is incorrect"
      });
    }
    var entity = {
      tutor_id: tutorID,
      tutee_id: payload.id,
      desc: req.body.description,
      start_time: startTime,
      rent_time: rentTime,
      rent_price: rentPrice * rentTime,
      create_time: ~~(Date.now() / 1000),
      status: ContractStatus.Pending
    } as ContractModel;
    if (!entity) {
      return res.json({
        code: -1,
        message: "Some fields is not correct"
      });
    }
    this.contractDB.setContract(entity, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: err.toString()
        });
      }

      var contractID = Number(data.insertId);
      if (!contractID || contractID < 0) {
        return res.json({
          code: -1,
          message: "Contract ID is invalid"
        });
      }
      // TODO: convert to async
      // this.socket.SendData("anvh2", "OK");
      this.userDB.getByID(payload.id, (err: Error, data: any) => {
        if (err) {
          console.log("[TuteeHandler][rentTutor][err]", err);
          return res.json({
            code: -1,
            mesage: err.toString()
          });
        }
        var tutee = data[0] as UserModel;
        if (!tutee) {
          console.log(
            "[TuteeHandler][rentTutor][notify][err] Data is not user model"
          );
          return res.json({
            code: -1,
            mesage: "Data is not user model"
          });
        }
        if (!tutee.name) {
          console.log(
            "[TuteeHandler][rentTutor][notify[err] Tutee name invalid"
          );
          return res.json({
            code: -1,
            mesage: "Tutee name invalid"
          });
        }
        console.log("=========", contractID);
        var notification = {
          user_id: tutorID,
          from_name: tutee.name,
          contract_id: contractID,
          description: GetContractDescription(tutee.name),
          create_time: ~~(Date.now() / 1000)
        } as NotificationModel;
        this.notiDB.setNotification(notification, (err: Error, data: any) => {
          if (err) {
            return res.json({
              code: -1,
              message: err.toString()
            });
          }
          return res.status(200).json({
            code: 1,
            meesage: "OK"
          });
        });
      });
    });
  }

  getListContractHistory(req: Request, res: Response) {
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

  getDetailContractHistory(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (!contractID || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload empty"
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

  evaluateRateForTutor(req: Request, res: Response) {
    var stars = Number(req.body.stars);
    if (stars < 0 || stars > 5) {
      return res.json({
        code: -1,
        message: "Stars is incorrect"
      });
    }
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
          message: "Get contract is incorrect"
        });
      }
      var contract = data[0] as ContractModel;
      console.log("[Tutee][evaluateContract][contract]", contract);
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model in database is incorrect"
        });
      }
      if (!contract.tutor_id) {
        return res.json({
          code: -1,
          message: "Tutor ID is empty"
        });
      }
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is invalid"
        });
      }
      if (contract.tutee_id != payload.id) {
        return res.json({
          code: -1,
          message: "Permission denied"
        });
      }
      if (contract.status != ContractStatus.Finished) {
        return res.json({
          code: -1,
          message: "Contract is not finished"
        });
      }
      console.log("[Tutee][evaluateContract][stars]", contract.stars);
      if (contract.stars != null) {
        return res.json({
          code: -1,
          message: "Contract is evaluated"
        });
      }
      var entity = {
        id: contractID,
        stars: stars
      };
      this.contractDB.updateContract(entity, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: "Update stars to database failed"
          });
        }
        if (contract.tutor_id) {
          this.tutorDB.updateRate(
            contract.tutor_id,
            stars,
            (err: Error, data: any) => {
              if (err) {
                return res.json({
                  code: -1,
                  message: err.toString()
                });
              }
              // notify to tutor
              var handle = function() {
                return new Promise(resolve => {
                  var notification = {
                    contractID: contract.cid,
                    topic: RateTopic,
                    description: GetRateDescription("")
                  } as NotifyModel;
                  SSE.SendMessage("", entity);
                });
              };
              var notify = async function() {
                console.log(
                  "[TuteeHandler][evaluateRateForTutor] start notify"
                );
                var result = await handle();
                console.log(
                  "[TuteeHandler][evaluateRateForTutor] finish notify"
                );
              };
              notify();

              return res.status(200).json({
                code: 1,
                message: "OK"
              });
            }
          );
        }
      });
    });
  }

  evaluateCommentForTutor(req: Request, res: Response) {
    var comment = req.body.comment;
    if (!comment) {
      return res.json({
        code: -1,
        message: "Comment is empty"
      });
    }
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
          message: "Get contract is incorrect"
        });
      }
      var contract = data[0] as ContractModel;
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model in database is incorrect"
        });
      }
      if (!contract.tutor_id) {
        return res.json({
          code: -1,
          message: "Tutor ID is empty"
        });
      }
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is invalid"
        });
      }
      if (contract.tutee_id != payload.id) {
        return res.json({
          code: -1,
          message: "Permission denied"
        });
      }
      if (contract.status != ContractStatus.Finished) {
        return res.json({
          code: -1,
          message: "Contract is not finished"
        });
      }
      console.log("[Tutee][evaluateCommentContract][data]", contract.comment);
      if (contract.comment != null) {
        return res.json({
          code: -1,
          message: "Contract is evaluated"
        });
      }
      var entity = {
        id: contractID,
        comment: comment
      };
      this.contractDB.updateContract(entity, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: "Update stars to database failed"
          });
        }
        // TODO: notify to tutor
        this.socket.SendData("anvh2", "OK");
        return res.status(200).json({
          code: 1,
          message: "OK"
        });
      });
    });
  }

  evaluateForTutor(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    var stars = Number(req.body.stars);
    if (stars == NaN || stars < 0 || stars > 5) {
      return res.json({
        code: -1,
        message: "Stars is incorrect"
      });
    }
    var comment = req.body.comment;
    if (!comment) {
      return res.json({
        code: -1,
        message: "Comment is empty"
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
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model in database is incorrect"
        });
      }
      if (!contract.tutor_id) {
        return res.json({
          code: -1,
          message: "Tutor ID is empty"
        });
      }
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is invalid"
        });
      }
      if (contract.tutee_id != payload.id) {
        return res.json({
          code: -1,
          message: "Permission denied"
        });
      }
      if (contract.status != ContractStatus.Finished) {
        return res.json({
          code: -1,
          message: "Contract is not finished"
        });
      }
      console.log("[Tutee][evaluateCommentContract][data]", contract.comment);
      if (
        (contract.comment && contract.comment.length > 0) ||
        (contract.stars && contract.stars > 0)
      ) {
        return res.json({
          code: -1,
          message: "Contract is evaluated"
        });
      }
      var entity = {
        cid: contractID,
        stars: stars,
        comment: comment
      };
      this.contractDB.updateContract(entity, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: "Update stars to database failed"
          });
        }
        if (contract.tutor_id) {
          this.tutorDB.updateRate(
            contract.tutor_id,
            stars,
            (err: Error, data: any) => {
              if (err) {
                return res.json({
                  code: -1,
                  message: err.toString()
                });
              }

              // notify to tutor
              var handle = function() {
                return new Promise(resolve => {
                  var notification = {
                    contractID: contract.cid,
                    topic: RateTopic,
                    description: GetRateDescription("")
                  } as NotifyModel;
                  SSE.SendMessage("", entity);
                });
              };
              var notify = async function() {
                console.log("[TuteeHandler][evaluateForTutor] start notify");
                var result = await handle();
                console.log("[TuteeHandler][evaluateForTutor] finish notify");
              };
              notify();

              return res.status(200).json({
                code: 1,
                message: "OK"
              });
            }
          );
        }
      });
    });
  }

  payContract(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (contractID < 0) {
      return res.json({
        code: -1,
        message: "ContractID is invalid"
      });
    }
    this.contractDB.getContract(contractID, (err: Error, data: any) => {
      if (err) {
        return res.json({
          code: -1,
          message: "Get contract failed"
        });
      }
      var contract = data[0] as ContractModel;
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model is incorrect"
        });
      }
      var payload = res.locals.payload;
      if (!payload) {
        return res.json({
          code: -1,
          message: "User payload is incorrect"
        });
      }
      if (contract.tutee_id != payload.id) {
        return res.json({
          code: 1,
          message: "Permission denied"
        });
      }
      if (contract.status != ContractStatus.Approved) {
        return res.json({
          code: -1,
          message: "Contract is not approved"
        });
      }
      // check amount and pay if ok
      var entity = {
        id: contract.cid,
        status: ContractStatus.Finished
      } as ContractModel;
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
    });
  }

  complainContract(req: Request, res: Response) {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is empty"
      });
    }
    var contractID = Number(req.params.contractID);
    if (contractID == NaN || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    var toID = Number(req.body.toID);
    if (toID == NaN || toID < 0) {
      return res.json({
        code: -1,
        message: "To ID is incorrect"
      });
    }
    var desc = req.body.description;
    if (!desc) {
      return res.json({
        code: -1,
        message: "Description is empty"
      });
    }
    var entity = {
      from_uid: payload.id,
      to_uid: toID,
      contract_id: contractID,
      description: desc,
      complain_time: ~~(Date.now() / 1000)
    } as ComplainModel;
    if (!entity) {
      return res.json({
        code: -1,
        message: "Complain model is incorrect"
      });
    }
    this.complainDB.setComlain(entity, (err: Error, data: any) => {
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
}
