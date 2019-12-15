import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride from "method-override";
import cors from "cors";

import { UserRoute } from "./routes/user";
import { AdminRoute } from "./routes/admin";
import { TutorRoute } from "./routes/tutor";

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  private app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express();
    this.config();
    this.api();
  }

  public Run(port: number) {
    this.app.listen(port, () => {
      console.log("[RunServer] server is runing on port", port);
    });
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    let userRouter = express.Router();
    new UserRoute().create(userRouter);
    let adminRouter = express.Router();
    new AdminRoute().create(adminRouter);
    let tutorRoute = express.Router();
    new TutorRoute().create(tutorRoute);

    this.app.use("/user", userRouter);
    this.app.use("/admin", adminRouter);
    this.app.use("/tutor", tutorRoute);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(cookieParser("SECRET_GOES_HERE"));
    this.app.use(methodOverride());
    this.app.use(cors());
    require("./plugins/middlewares/passport");

    //catch 404 and forward to error handler
    this.app.use(function(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });
    this.app.use(errorHandler());
  }
}
