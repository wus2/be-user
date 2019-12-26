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
  INIT = "init",
  DISCONNECT = "disconnect"
}

export interface SocketConn {
  id: string;
  socket: io.Socket;
}

interface ChatData {
  tutor?: string;
  tutee?: string;
  sender?: string;
  receiver?: string;
  message?: string;
}

export interface ISocketServer {}

export class SocketServer implements ISocketServer {
  private static instance: SocketServer;

  io: SocketIO.Server;
  clients: Map<string, SocketConn>;
  messageDB: IMessageDB;
  secretKey: string;

  private constructor(server: http.Server) {
    this.io = io(server);
    this.io.origins("*:*")
    this.clients = new Map<string, SocketConn>();
    this.messageDB = new MessageDB();
    this.secretKey = config.get("key_jwt");
  }

  public static Init(server: http.Server): SocketServer {
    if (!SocketServer.instance) {
      this.instance = new SocketServer(server);
    }
    return this.instance;
  }

  public static async Instance() {
    function getInstance() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(SocketServer.instance);
        }, 5000);
      });
    }

    return await getInstance();
  }

  public Start() {
    console.log("[SocketServer][Start]Socket server is running");
    this.onConnect();
  }

  public SendData(receiver: string, data: any) {
    this.clients.forEach(conn => {
      if (conn.id === receiver) {
        console.log("[SocketServer][SendData][data]", data);
        conn.socket.emit("notification", JSON.stringify(data));
        return;
      }
    });
  }

  private onConnect() {
    this.io.on("connection", socket => {
      console.log("Client connecting", socket.id);

      socket.on(Event.INIT, (username: string) => {
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

      socket.emit(Event.INIT, socket.id);

      this.onChat(socket);

      this.onDisconnect(socket);
    });
  }

  private onChat(socket: io.Socket) {
    socket.on(Event.CHAT, (payload: any) => {
      var data = payload as ChatData;
      if (
        !data.tutor ||
        !data.tutee ||
        !data.sender ||
        !data.receiver ||
        !data.message ||
        data.message.length <= 0
      ) {
        console.log("Data is incorrect");
        return;
      }
      console.log("[SocketServer][SendMessage][data]", data);

      // send message
      this.clients.forEach(conn => {
        if (conn.id === data.receiver || conn.id == data.sender) {
          console.log("============send message================");
          conn.socket.emit("chat", {
            id: socket.id,
            sender: data.sender,
            message: data.message
          });
          return;
        }
      });

      var room = data.tutee + ":" + data.tutor;

      // storage message
      var entity = {
        room: room,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        send_time: ~~(Date.now() / 1000)
      } as MessageModel;
      this.messageDB.setMessage(entity, (err: Error, data: any) => {
        if (err) {
          console.log("[SocketServer][StorageMessage][err]", err);
        }
        console.log("[SocketServer[StorageMessage] OK");
      });
    });
  }

  private onListening(sender: io.Socket, receiver: io.Socket, room: string) {
    sender.on(`${room}`, message => {
      console.log("data", message);
    });
  }

  private onDisconnect(disSocket: io.Socket) {
    disSocket.on(Event.DISCONNECT, () => {
      console.log(disSocket.id, "is disconnected");
      this.clients.delete(disSocket.id);
      console.log(this.clients);
    });
  }
}
