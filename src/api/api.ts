import { Router, NextFunction, Request, Response } from "express";

/**
 * / route
 *
 * @class User
 */
export class APIRoute {
  constructor() {}
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.post("/tunnels", (req, res) => {
      console.log(req);
      return res.send("Tunnels");
    });
  }
}
