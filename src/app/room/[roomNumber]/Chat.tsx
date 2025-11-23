"use client";

import { ClientToServerEvents, ServerToClientEvents } from '@/ws/api';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { io, Socket } from "socket.io-client";
import type { Message, Player, RefreshRef } from '../../types';
import { flip } from '../../util';
import ChatBox from './components/ChatBox';
import Controls from './components/Controls';
import { ErrorToast } from './components/ErrorToast';
import PlayerPanel from './components/PlayerPanel';
import { getConfig } from './data';
import { setupSocket } from './socket';

export default (props: { roomNumber: string }) => {
    const socketRef = setupSocket(socketEvents);
    const [messages, setMessages] = useState<Message[]>([]);
    const [errorToast, setErrorToast] = useState("");
    const config = getConfig();
    const input_fields = [
        [useRef(""), useRef<RefreshRef>(null)],
        [useRef(""), useRef<RefreshRef>(null)]
    ] as const;
    var player_i : 0 | 1 = 0;
    useEffect(()=>{
        console.log(`Turn: ${config.character_i(config.turn.value).name}`);
        console.log(`Character: ${config.character_i(config.player1.character).name}`);
    }, [config.turn.value, config.player1.character]);

    function socketEvents(socket: Socket) {
        socket.on("connect", () => {
            console.log("WebSocket connected");
            // config.turn.set()
        });

        socket.on("chatMessage", message => {
            setMessages((prev) => [...prev, message]);
            input_fields[player_i][0].current = "";
            input_fields[player_i][1].current?.refresh();
            _nextTurn();
        });

        socket.on("swapCharacter", foo => {
            console.log("Got swapCharacter from the server");
            _swapCharacter();
        });

        socket.on("text", text => {
            console.log("Socket message from server: ", text);
        });
    }

    function sendMessage() {
        const player_message = input_fields[player_i][0].current;
        if (!_validMessage(player_message)) return;

        const player = config.player_i(player_i);
        const character = config.character_i(player.character);
        const newMessage: Message = {
            player: player,
            text: player_message,
            character: character,
            switched: false,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages((prev) => [...prev, newMessage]);
        socketRef.current?.emit('chatMessage', newMessage);
        _resetPlayerInput();
        _nextTurn();

    };

    function switchRoles() {
        const switchState = !messages.slice(-1)[0]?.switched;
        _swapCharacter();
        socketRef.current?.emit("swapCharacter");
        setMessages((prevMessages) => {
            const lastMessage = prevMessages.slice(-1)[0];
            if (lastMessage) lastMessage.switched = switchState;
            return [...prevMessages];
        });
    };

    function endChat() {
        setMessages([]);
    };

    function _validMessage(player_message: string): boolean {
        if (player_message.trim() !== '') return true;
        setErrorToast("Cannot send an empty message.");
        return false;
    }

    function _swapCharacter(){
        const player = config.player_i(player_i);
        const [from, to] = [config.characters[player.character].name, config.characters[flip(player.character)].name]
        console.log(`Character swap from ${from} to ${to}`);
        console.log(player.character);
        console.log(flip(player.character));
        player.setCharacter(c => flip(c));
    }

    function _nextTurn(){
        config.turn.set(turn => flip(turn));
    }

    function _resetPlayerInput(){
        input_fields[player_i][0].current = "";
        input_fields[player_i][1].current?.refresh();
    }
    return (
        <div className="flex flex-col h-full w-full min-h-fit">
            <h3 className='text-center text-2xl font-bold'>Room {props.roomNumber}</h3>
            {errorToast && <ErrorToast message={errorToast} />}
            <ChatBox messages={messages} />
            <Controls
                sendMessage={sendMessage}
                switchRoles={switchRoles}
                endChat={endChat}
            />
            <div className="flex flex-row gap-1 mt-5">
                <PlayerPanel
                    player={config.players[player_i]}
                    message={input_fields[player_i][0] as RefObject<string>}
                    ref={input_fields[player_i][1] as RefObject<RefreshRef>}
                    sendMessage={sendMessage}
                    config={config}
                />
            </div>
        </div>
    );
};
