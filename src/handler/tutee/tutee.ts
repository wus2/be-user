import { Request, Response, NextFunction } from "express";
import {
  IContractDB,
  ContractDB,
  ContractModel,
  Status
} from "../../plugins/database/contract/contract";

export interface ITutorHandler {
  rentTutor(req: Request, res: Response): void;
  getListHistory(req: Request, res: Response): void;
  getDetailHistory(req: Request, res: Response): void;
  evaluateRateForTutor(req: Request, res: Response): void;
  evaluateCommentForTutor(req: Request, res: Response): void;
  payContract(req: Request, res: Response): void;
  complainContract(req: Request, res: Response): void;
  chat(req: Request, res: Response): void;
}

export class TutorHandler implements ITutorHandler {
  contractDB: IContractDB;

  constructor() {
    this.contractDB = new ContractDB();
  }

  rentTutor(req: Request, res: Response) {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is undefined"
      });
    }
    var startTime = Date.parse(req.body.startTime);
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
      start_time: startTime / 1000,
      rent_time: rentTime,
      rent_price: rentPrice,
      create_time: Date.now(),
      contract_status: Status.Pending
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
      // TODO: notify to tutor
      // TODO: send to worker check expired
      return res.status(200).json({
        code: 1,
        meesage: "OK"
      });
    });
  }

  getListHistory(req: Request, res: Response) {}

  getDetailHistory(req: Request, res: Response) {}

  evaluateRateForTutor(req: Request, res: Response) {}

  evaluateCommentForTutor(req: Request, res: Response) {}

  payContract(req: Request, res: Response) {}

  complainContract(req: Request, res: Response) {}

  chat(req: Request, res: Response) {}
}
