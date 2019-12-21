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
            console.log("Client connected", socket.id);
            _this.clients.set(socket.id, socket);
            _this.onChat(socket);
            _this.onDisconnect(socket);
        });
    };
    SocketServer.prototype.onChat = function (socket) {
        var _this = this;
        socket.on(Event.CHAT, function (data) {
            data = data;
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
        var _this = this;
        sender.on("" + room, function (message) {
            console.log("data", message);
            _this.sendMessage(receiver, room, message);
        });
    };
    SocketServer.prototype.sendMessage = function (receiver, room, message) {
        receiver.to("" + room).emit("" + message);
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
