"use client";

import { ServerToClientEvents, ClientToServerEvents } from "@/ws/api";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getConfig } from "../room/[roomNumber]/data";
import PlayerPanel from "../room/[roomNumber]/components/PlayerPanel";
import { RefreshRef } from "../types";

export default () => {
    const [foo, setFoo] = useState(0);
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>(null);
    const config = getConfig();
    const setCharacter = config.player1.setCharacter;
    useEffect(() => {
        socketRef.current = io();
        let socket = socketRef.current;

        socket.on("connect", () => {
            console.log("WebSocket connected");
            _swapCharacter();
            // change some state here
        });

        function _updateFoo() {
            setFoo(f => f + 1);
        }

        return () => {
            console.log("Closing WebSocket...");
            socket.close();
        };
    }, []);

    function flip(f: number | 0 | 1): 0 | 1 {
        return 1 - f as 0 | 1;
    }

    function _swapCharacter() {
        const player = config.player_i(0);
        player.setCharacter(c => flip(c));
    }

    function _nextTurn(){
        config.turn.set(t => flip(t));
    }

    return (
        <>
            <p> [player 0 character i]: {config.player1.character} </p>
            <p> [char name]: {config.characters[config.player1.character].name} </p>
            <p> [turn]: {config.turn.value}, {config.character_i(config.turn.value).name} </p>
            <button className="border-1 p-4" onClick={_swapCharacter}> swap character </button>
            <button className="border-1 p-4" onClick={_nextTurn}> update turn</button>

            <PlayerPanel
                player={config.player1}
                message={null as any as React.RefObject<string>}
                ref={null as any as Ref<RefreshRef>}
                sendMessage={() => {}}
                config={config}
            />
        </>
    )
};
