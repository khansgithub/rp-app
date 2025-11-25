import { ServerToClientEvents, ClientToServerEvents } from "@/ws/api";
import { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";


export function setupSocket(socketEventFunction: ((s: Socket) => void)) {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);
    useEffect(() => {
        socketRef.current = io();
        let socket = socketRef.current;

        // socket.on("connect", () => {
        //     console.log("WebSocket connected");
        // });

        socketEventFunction(socket);

        return () => {
            console.log("Closing WebSocket...");
            socket.close();
        };
    }, []);
    
    return socketRef;
}