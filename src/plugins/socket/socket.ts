import http from "http";
import io from "socket.io";
import { IMessageDB, MessageDB } from "../database/message/message";

export enum Event {
  Matching = "matching",
  Disconnected = "disconnected"
}

export interface SocketData {
  senderID?: number;
  receiverID?: number;
  room?: string;
}

export interface ISocket {}

export class Socket implements ISocket {
  io: SocketIO.Server;
  currentUsers: Map<string, io.Socket>;
  messageDB: IMessageDB;

  constructor(server: http.Server) {
    this.io = io(server);
    this.currentUsers = new Map<string, io.Socket>();
    this.messageDB = new MessageDB();
  }

  public Start() {
    this.io.on("connection", socket => {
      socket.on(Event.Matching, (data, callback) => {
        data = data as SocketData;
        if (!data.senderID || !data.receiverID) {
          callback({
            code: -1,
            message: "User data is incorrect"
          });
        }
        if (!data.room) {
          var room = this.messageDB.getRoom(data.senderID, data.receiverID);
          if (!room) {
            room = this.messageDB.generateRoom(data.senderID, data.receiverID);
            // TODO: return room for user
          }
        }
        if (this.currentUsers.has(data.senderID)) {
          return;
        }

        var receiver = this.currentUsers.get(data.receiverID);
        if (receiver) {
        }

        this.currentUsers.set(data.senderID, socket);
        callback({
          code: 1,
          message: "Connected"
        });
      });

      this.onDisconnect(socket);
    });
  }

  onConnect() {}

  onListening(sender: io.Socket, receiver: io.Socket, room: string) {
    sender.on(`${room}`, message => {
      console.log("data", message);
      this.sendMessage(receiver, room, message);
    });
  }

  sendMessage(receiver: io.Socket, room: string, message: string) {
    receiver.to(`${room}`).emit(`${message}`);
  }

  onDisconnect(socket: io.Socket) {
    socket.on(Event.Disconnected, () => {
      console.log(socket.id, "is disconnected");
      console.log(this.currentUsers);
    });
  }
}
