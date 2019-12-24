"use strict";
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
    SocketServer.prototype.Start = function () {
        this.onConnect();
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
        socket.on(Event.CHAT, function (data) {
            // data = data as SocketData;
            if (!data.senderID || !data.receiverID || !data.room) {
                return;
            }
            console.log(data);
            // send message
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
    SocketServer.prototype.SendData = function (receiver, data) {
        this.clients.forEach(function (conn) {
            if (conn.id === receiver) {
                conn.socket.emit("notification", JSON.stringify(data));
                return;
            }
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
