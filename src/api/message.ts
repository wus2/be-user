import { Router, NextFunction, Request, Response } from "express";
import Authenticate from "../plugins/middlewares/authen";
import { MessageDB } from "../plugins/database/message/message";

/**
 * / route
 *
 * @class User
 */
export class MessageRoute {
  constructor() {}
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.post(
      "/mess/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page <= 0 || limit < 0) {
          return res.json({
            code: -1,
            message: "Page or limit is incorrect"
          });
        }
        var room = req.body.room;
        if (!room) {
          return res.json({
            code: -1,
            message: "Room is incorrect"
          });
        }
        var payload = res.locals.payload;
        if (!payload) {
          return res.json({
            code: -1,
            message: "User payload is empty"
          });
        }
        var offset = (page - 1) * 12;
        new MessageDB().getMessageHistory(
          room,
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
    );
  }
}
