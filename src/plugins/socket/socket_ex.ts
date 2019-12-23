import http from "http";
import io from "socket.io";
import socketJWT, { JwtAuthOptions } from "socketio-jwt";
import config from "config";
import {
  IMessageDB,
  MessageDB,
  MessageModel
} from "../database/message/message";

export enum Event {
  CHAT = "chat",
  DISCONNECT = "disconnect"
}

export interface SocketConn {
  id: string;
  socket: io.Socket;
}

export interface ISocketServer {}

export class SocketServer implements ISocketServer {
  io: SocketIO.Server;
  clients: Map<string, SocketConn>;
  messageDB: IMessageDB;
  secretKey: string;

  constructor(server: http.Server) {
    this.io = io(server);
    this.clients = new Map<string, SocketConn>();
    this.messageDB = new MessageDB();
    this.secretKey = config.get("key_jwt");
  }

  public Start() {
    this.onConnect();
  }

  onConnect() {
    this.io.on("connection", socket => {
      console.log("Client connecting", socket.id);

      socket.on("init", (username: string) => {
        if (!username) {
          return;
        }
        var conn = {
          id: username,
          socket: socket
        } as SocketConn;
        this.clients.set(socket.id, conn);
        console.log("Client connected", socket.id);
      });

      socket.on("chat", (data: any) => {
        console.log(data);
      });

      this.onDisconnect(socket);
    });
  }

  onChat(socket: io.Socket) {
    socket.on(Event.CHAT, (data: any) => {
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
      } as MessageModel;
      this.messageDB.setMessage(entity, (err: Error, data: any) => {
        if (err) {
          console.log("[SocketServer][StorageMessage][err]", err);
        }
        console.log("[SocketServer[StorageMessage] OK");
      });
    });
  }

  onListening(sender: io.Socket, receiver: io.Socket, room: string) {
    sender.on(`${room}`, message => {
      console.log("data", message);
    });
  }

  public SendData(receiver: string, data: any) {
    this.clients.forEach(conn => {
      if (conn.id === receiver) {
        conn.socket.emit("notification", JSON.stringify(data));
        return;
      }
    });
  }

  onDisconnect(disSocket: io.Socket) {
    disSocket.on(Event.DISCONNECT, () => {
      console.log(disSocket.id, "is disconnected");
      this.clients.delete(disSocket.id);
      console.log(this.clients);
    });
  }
}
