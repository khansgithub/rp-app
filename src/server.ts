import express from 'express';
import next from 'next';

import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';

import {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketProperties
} from './ws/api';
import { EventsMap, StrictEventEmitter } from 'socket.io/dist/typed-events';
import { flip } from './app/util';

const app = next({ dev: true });
const express_app = express();
const server = createServer(express_app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, EventsMap, SocketProperties>(server);
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.prepare().then(() => {
    express_app.use(express.json());
    express_app.all(
        '/{*any}',
        (req: express.Request, res: express.Response) => app.getRequestHandler()(req, res)
    );
    setUpSocket(io);
    server.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
});

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, EventsMap, SocketProperties>;
const socket_player: [ChatSocket?, ChatSocket?] = [undefined, undefined];
const room_name = "room1" as const;
const max_room_size: number = 2 as const;
var player_i: number = 0;

function setUpSocket(IO: typeof io) {
    IO.use((socket, next) => {
        const player_i = socket_player.findIndex(x => x === undefined);

        if (player_i == -1){
            console.log("Max users reached")
            return next(new Error("Max users reached"))
        }

        socket_player[player_i] = socket;
        socket.data.player_number = player_i as 0 | 1;
        console.log(socket.id, "->", player_i, socket.data.player_number);
        socket.join(room_name);
        return next();
    });

    IO.on("connection", socket => {
        console.log("Client connected");
        console.log("player_number: ", socket.data.player_number);
        console.log("id: ", socket.id);
        console.log("Event names", socket.eventNames());

        if (socket.data.player_number == 0 ){
            // the 2nd player joins
            console.log("Second player has joined");
            socket.emit("swapCharacter");
        }

        socket.emit("text", `You are player: ${socket.data.player_number}`)

        socket.on("chatMessage", message => {
            console.log("got message from client");
            let other_socket = socket_player[flip(socket.data.player_number)]
            other_socket?.emit("chatMessage", message);
        });

        socket.on("swapCharacter", () => {
            let other_socket = socket_player[flip(socket.data.player_number)]
            other_socket?.emit("swapCharacter");
        })

        socket.on("disconnect", reason => {
            socket_player[socket.data.player_number] = undefined; 
        });
    });
}