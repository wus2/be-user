import { Router, NextFunction, Request, Response } from "express";

import Authenticate from "../plugins/middlewares/authen";
import { ITuteeHandler, TuteeHandler } from "../handler/tutee/tutee";

/**
 * / route
 *
 * @class User
 */
export class TuteeRoute {
  handler: ITuteeHandler;

  constructor() {
    this.handler = new TuteeHandler();
  }
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.post(
      "/renttutor",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.rentTutor(req, res);
      }
    );

    router.get(
      "/contracthistory/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.getListContractHistory(req, res);
      }
    );

    router.get(
      "/contract/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.getDetailContractHistory(req, res);
      }
    );

    router.post(
      "/evaluaterate/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.evaluateRateForTutor(req, res);
      }
    );

    router.post(
      "/evaluatecomment/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.evaluateCommentForTutor(req, res);
      }
    );

    router.post(
      "/evaluate/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.evaluateForTutor(req, res);
      }
    );

    router.post(
      "/paycontract/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.payContract(req, res);
      }
    );

    router.post(
      "/complaincontract/:contractID",
      (req, res, next) => {
        Authenticate.forTutee(req, res, next);
      },
      (req, res) => {
        this.handler.complainContract(req, res);
      }
    );
  }
}
