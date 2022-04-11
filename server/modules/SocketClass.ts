import { Server, Socket } from "socket.io"
import { createServer } from "http"
import { parse } from "querystring"
import { Exam } from "./types"


const express = require("express")

export class SocketClass {
    static instance: SocketClass
    private app = express()
    http = createServer(this.app)
    private io = new Server(this.http, {
        cors: {
            origin: "*",
        }
    })
    private port = process.env.PORT || 3002
    private admin: Socket = null as any
    private data = {} as Exam
    private sessions: number[] = []
    private live: number[] = []
    private constructor() {
        this.io.on("connection", (socket: Socket) => {
            let { room } = parse(socket.request.url?.split("?")[1] || "")
            if (room !== "admin" && (!this.sessions.includes(Number(room)) /*|| this.live.includes(Number(room))*/)) {
                socket.emit("invalid")
                socket.disconnect(true)
            }
            else if (room === "admin") {
                this.admin = socket
                this.admin.emit("created", this.sessions)
                this.admin.emit("live", this.live)
                this.admin.emit("exam", this.data)
                this.adminEvents()
            }
            else {
                socket.join(room as string)
                this.live.push(Number(room))
                if (this.admin) this.admin.emit("live", this.live)
                socket.emit("joined", room)
                socket.emit("data", this.data[String(room)])
                this.clientEvents(socket)
            }
        })
    }
    static getInstance() {
        if (!SocketClass.instance) {
            SocketClass.instance = new SocketClass()
        }
        return SocketClass.instance
    }
    adminEvents() {
        this.admin.on("create", () => {
            this.admin.emit("created", this.random4Digit())
        })
        this.admin.on("exam", ({ data, room }) => {
            this.data = data
            this.admin.emit("exam", this.data)
            //let rooms = Array.from(this.io.sockets.adapter.rooms.keys())
            this.admin.to(String(room)).emit("data", this.data[String(room)])
        })
        this.admin.on("deleteSession", (id: number) => {
            this.sessions.splice(this.sessions.indexOf(id), 1)
            this.live.splice(this.live.indexOf(id), 1)
            delete this.data[String(id)]
            this.admin.emit("created", this.sessions)
            this.admin.emit("exam", this.data)
            this.admin.emit("live", this.live)
            this.admin.to(String(id)).emit("ended")
        })
    }
    clientEvents(socket: Socket) {
        socket.on("disconnect", () => {
            let room = Array.from(socket.rooms)[0]
            this.live.splice(this.live.indexOf(Number(room)), 1)
            if (this.admin) this.admin.emit("live", this.live)
        })
        socket.on("answers", ({ room, data }) => {
            this.data[String(room)] = data
            if (this.admin) this.admin.emit("exam", this.data)
        })
    }
    random4Digit(): number[] {
        var val = Math.floor(1000 + Math.random() * 9000);
        this.sessions.push(val)
        return this.sessions
    }
}
