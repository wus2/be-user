"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = __importStar(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path = __importStar(require("path"));
var errorHandler = require("errorhandler");
var method_override_1 = __importDefault(require("method-override"));
var cors_1 = __importDefault(require("cors"));
var user_1 = require("./api/user");
var admin_1 = require("./api/admin");
var tutor_1 = require("./api/tutor");
var tutee_1 = require("./api/tutee");
var sse_1 = require("./plugins/sse/sse");
/**
 * The server.
 *
 * @class Server
 */
var Server = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        this.app = express_1.default();
        this.config();
        this.api();
    }
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.Run = function (port) {
        this.app.listen(port, function () {
            console.log("[RunServer] server is runing on port", port);
        });
    };
    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    Server.prototype.api = function () {
        var userRouter = express_1.default.Router();
        new user_1.UserRoute().create(userRouter);
        var adminRouter = express_1.default.Router();
        new admin_1.AdminRoute().create(adminRouter);
        var tutorRoute = express_1.default.Router();
        new tutor_1.TutorRoute().create(tutorRoute);
        var tuteeRoute = express_1.default.Router();
        new tutee_1.TuteeRoute().create(tuteeRoute);
        this.app.use("/user", userRouter);
        this.app.use("/admin", adminRouter);
        this.app.use("/tutor", tutorRoute);
        this.app.use("/tutee", tuteeRoute);
        this.app.use("/event/:username", function (req, res, next) {
            sse_1.SSE.EventsHandler(req, res, next);
        });
    };
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    Server.prototype.config = function () {
        this.app.use(express_1.default.static(path.join(__dirname, "public")));
        this.app.use(morgan_1.default("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookie_parser_1.default("SECRET_GOES_HERE"));
        this.app.use(method_override_1.default());
        this.app.use(cors_1.default());
        require("./plugins/middlewares/passport");
        //catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    };
    return Server;
}());
exports.Server = Server;
