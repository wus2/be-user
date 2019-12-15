import { Request, Response, NextFunction } from "express";
import TutorDB, { Model, ITutorDB } from "../../plugins/database/tutor/tutor";

export interface ITutorHandler {
  enrollClass(req: Request, res: Response): void;
  getListHistory(req: Request, res: Response): void;
  getDetailHistory(req: Request, res: Response): void;
  evaluateRateForTutor(req: Request, res: Response): void;
  evaluateCommentForTutor(req: Request, res: Response): void;
  payContract(req: Request, res: Response): void;
  complainContract(req: Request, res: Response): void;
  chat(req: Request, res: Response): void;
}

export class TutorHandler implements ITutorHandler {
  tutorDB: ITutorDB;

  constructor() {
    this.tutorDB = new TutorDB();
  }

  enrollClass(req: Request, res: Response) {}

  getListHistory(req: Request, res: Response) {}

  getDetailHistory(req: Request, res: Response) {}

  evaluateRateForTutor(req: Request, res: Response) {}

  evaluateCommentForTutor(req: Request, res: Response) {}

  payContract(req: Request, res: Response) {}

  complainContract(req: Request, res: Response) {}

  chat(req: Request, res: Response) {}
}
