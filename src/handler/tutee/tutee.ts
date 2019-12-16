import { Request, Response, NextFunction } from "express";
import {
  IContractDB,
  ContractDB,
  ContractModel,
  ContractStatus
} from "../../plugins/database/contract/contract";

export interface ITutorHandler {
  rentTutor(req: Request, res: Response): void;
  getListContractHistory(req: Request, res: Response): void;
  getDetailContractHistory(req: Request, res: Response): void;
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
      contract_status: ContractStatus.Pending
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

  getListContractHistory(req: Request, res: Response) {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is invalid"
      });
    }
    var offset = Number(req.params.offset);
    var limit = Number(req.params.limit);
    if (offset < 0 || limit < 0) {
      return res.json({
        code: -1,
        message: "Offset or limit is incorrect"
      });
    }
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

  getDetailContractHistory(req: Request, res: Response) {
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
      return res.status(200).json({
        code: 1,
        message: "OK",
        data: data[0]
      });
    });
  }

  evaluateRateForTutor(req: Request, res: Response) {
    var stars = Number(req.params.stars);
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
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model in database is incorrect"
        });
      }
      if (contract.contract_status != ContractStatus.Finished) {
        return res.json({
          code: -1,
          message: "Contract is not finished"
        });
      }
      console.log("[Tutee][evaluateContract][data]", contract.stars);
      if (!contract.stars || contract.stars != null) {
        res.json({
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
        return res.status(200).json({
          code: 1,
          message: "OK"
        });
      });
    });
  }

  evaluateCommentForTutor(req: Request, res: Response) {}

  payContract(req: Request, res: Response) {}

  complainContract(req: Request, res: Response) {}

  chat(req: Request, res: Response) {}
}
