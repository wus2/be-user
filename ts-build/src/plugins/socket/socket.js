"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var message_1 = require("../database/message/message");
var Event;
(function (Event) {
    Event["Matching"] = "matching";
    Event["Disconnected"] = "disconnected";
})(Event = exports.Event || (exports.Event = {}));
var Socket = /** @class */ (function () {
    function Socket(server) {
        this.io = socket_io_1.default(server);
        this.currentUsers = new Map();
        this.messageDB = new message_1.MessageDB();
    }
    Socket.prototype.Start = function () {
        var _this = this;
        this.io.on("connection", function (socket) {
            socket.on(Event.Matching, function (data, callback) {
                data = data;
                if (!data.senderID || !data.receiverID) {
                    callback({
                        code: -1,
                        message: "User data is incorrect"
                    });
                }
                if (!data.room) {
                    var room = _this.messageDB.getRoom(data.senderID, data.receiverID);
                    if (!room) {
                        room = _this.messageDB.generateRoom(data.senderID, data.receiverID);
                        // TODO: return room for user
                    }
                }
                if (_this.currentUsers.has(data.senderID)) {
                    return;
                }
                var receiver = _this.currentUsers.get(data.receiverID);
                if (receiver) {
                }
                _this.currentUsers.set(data.senderID, socket);
                callback({
                    code: 1,
                    message: "Connected"
                });
            });
            _this.onDisconnect(socket);
        });
    };
    Socket.prototype.onConnect = function () { };
    Socket.prototype.onListening = function (sender, receiver, room) {
        var _this = this;
        sender.on("" + room, function (message) {
            console.log("data", message);
            _this.sendMessage(receiver, room, message);
        });
    };
    Socket.prototype.sendMessage = function (receiver, room, message) {
        receiver.to("" + room).emit("" + message);
    };
    Socket.prototype.onDisconnect = function (socket) {
        var _this = this;
        socket.on(Event.Disconnected, function () {
            console.log(socket.id, "is disconnected");
            console.log(_this.currentUsers);
        });
    };
    return Socket;
}());
exports.Socket = Socket;
