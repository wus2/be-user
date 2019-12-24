"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var config_1 = __importDefault(require("config"));
var message_1 = require("../database/message/message");
var Event;
(function (Event) {
    Event["CHAT"] = "chat";
    Event["DISCONNECT"] = "disconnect";
})(Event = exports.Event || (exports.Event = {}));
var SocketServer = /** @class */ (function () {
    function SocketServer(server) {
        this.io = socket_io_1.default(server);
        this.clients = new Map();
        this.messageDB = new message_1.MessageDB();
        this.secretKey = config_1.default.get("key_jwt");
    }
    SocketServer.Init = function (server) {
        if (!SocketServer.instance) {
            this.instance = new SocketServer(server);
        }
        return this.instance;
    };
    SocketServer.Instance = function () {
        return __awaiter(this, void 0, void 0, function () {
            function getInstance() {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(SocketServer.instance);
                    }, 5000);
                });
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getInstance()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SocketServer.prototype.Start = function () {
        console.log("[SocketServer][Start]Socket server is running");
        this.onConnect();
    };
    SocketServer.prototype.SendData = function (receiver, data) {
        this.clients.forEach(function (conn) {
            if (conn.id === receiver) {
                console.log("[SocketServer][SendData][data]", data);
                conn.socket.emit("notification", JSON.stringify(data));
                return;
            }
        });
    };
    SocketServer.prototype.onConnect = function () {
        var _this = this;
        this.io.on("connection", function (socket) {
            console.log("Client connecting", socket.id);
            socket.on("init", function (username) {
                if (!username) {
                    return;
                }
                var conn = {
                    id: username,
                    socket: socket
                };
                _this.clients.set(socket.id, conn);
                console.log("Client connected", socket.id);
            });
            socket.on("chat", function (data) {
                console.log(data);
            });
            _this.onDisconnect(socket);
        });
    };
    SocketServer.prototype.onChat = function (socket) {
        var _this = this;
        socket.on(Event.CHAT, function (payload) {
            var data = payload;
            if (!data.sender || !data.receiver || !data.room) {
                return;
            }
            console.log(data);
            // send message
            _this.clients.forEach(function (conn) {
                if (conn.id === data.receiver) {
                    console.log("[SocketServer][SendMessage][data]", data);
                    conn.socket.emit("chat", JSON.stringify(data)); // to room
                    return;
                }
            });
            // storage message
            var entity = {
                room: data.room,
                sender_id: data.senderID,
                receiver_id: data.receiverID,
                message: data.message
            };
            _this.messageDB.setMessage(entity, function (err, data) {
                if (err) {
                    console.log("[SocketServer][StorageMessage][err]", err);
                }
                console.log("[SocketServer[StorageMessage] OK");
            });
        });
    };
    SocketServer.prototype.onListening = function (sender, receiver, room) {
        sender.on("" + room, function (message) {
            console.log("data", message);
        });
    };
    SocketServer.prototype.onDisconnect = function (disSocket) {
        var _this = this;
        disSocket.on(Event.DISCONNECT, function () {
            console.log(disSocket.id, "is disconnected");
            _this.clients.delete(disSocket.id);
            console.log(_this.clients);
        });
    };
    return SocketServer;
}());
exports.SocketServer = SocketServer;
