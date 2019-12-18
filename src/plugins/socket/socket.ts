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
  currConn: Map<string, io.Socket>;
  messageDB: IMessageDB;

  constructor(server: http.Server) {
    this.io = io(server);
    this.currConn = new Map<string, io.Socket>();
    this.messageDB = new MessageDB();
  }

  public Start() {
    this.onConnect();
  }

  onConnect() {
    this.io.on("connection", socket => {
      socket.on(Event.Matching, (data, callback) => {
        data = data as SocketData;
        if (!data.senderID || !data.receiverID) {
          callback({
            code: -1,
            message: "User data is incorrect"
          });
        }
      });

      this.onDisconnect(socket);
    });
  }

  onListening(sender: io.Socket, receiver: io.Socket, room: string) {
    sender.on(`${room}`, message => {
      console.log("data", message);
      this.sendMessage(receiver, room, message);
    });
  }

  sendMessage(receiver: io.Socket, room: string, message: string) {
    receiver.to(`${room}`).emit(`${message}`);
  }

  onDisconnect(disSocket: io.Socket) {
    disSocket.on(Event.Disconnected, () => {
      console.log(disSocket.id, "is disconnected");
      this.currConn.forEach((socket: io.Socket, key: string) => {
        if (socket.id === disSocket.id) {
          this.currConn.delete(key);
        }
      });
      console.log(this.currConn);
    });
  }
}
