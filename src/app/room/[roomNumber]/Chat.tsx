"use client";

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Socket } from "socket.io-client";
import type { Message, RefreshRef } from '../../types';
import { flip } from '../../util';
import ChatBox from './components/ChatBox';
import Controls from './components/Controls';
import { ErrorToast } from './components/ErrorToast';
import PlayerPanel from './components/PlayerPanel';
import { getConfig } from './data';
import { setupSocket } from './socket';
import { ClientToServerEvents } from '@/ws/api';

export default (props: { roomNumber: string }) => {
    const socketRef = setupSocket(socketEvents);
    const config = getConfig();
    const input_fields = [
        [useRef(""), useRef<RefreshRef>(null)],
        [useRef(""), useRef<RefreshRef>(null)]
    ] as const;

    const [messages, setMessages] = useState<Message[]>([]);
    const [errorToast, setErrorToast] = useState("");
    const [roomFull, setRoomFull] = useState(false);

    var player_i: 0 | 1 = 0;


    useEffect(() => {
        console.log(messages);
    }, [messages]);

    function socketEvents(socket: Socket) {
        socket.on("connect", () => {
        });

        socket.on("chatMessage", message => {
            setMessages((prev) => [...prev, message]);
            input_fields[player_i][0].current = "";
            input_fields[player_i][1].current?.refresh();
            _nextTurn();
        });

        socket.on("swapRole", () => {
            switchRoles();
        });

        socket.on("endChat", () => {
            endChat();
        })

        socket.on("swapCharacter", foo => {
            _swapCharacter();
        });

        socket.on("roomFull", () => {
            setRoomFull(true);
        })

        socket.on("text", text => {
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

    // function switchRolesButton() {
    //     socketRef.current?.emit("swapRole");
    //     switchRoles();
    // };

    function switchRoles() {
        console.log("switch roles", messages);
        _swapCharacter();
        _nextTurn();
        _setLastMessageSwitched();
    }

    // function endChatButton() {
    //     socketRef.current?.emit("endChat");
    //     endChat();
    // };

    function endChat() {
        setMessages([]);
    }

    // function emit(event: keyof ClientToServerEvents) {
    //     socketRef.current?.emit(event);

    //     return {
    //         and<T extends (...args: any[]) => any>(callback: T, ...args: Parameters<T>) {
    //             callback(...args);
    //         },
    //     };
    // }

    function emit (event: keyof ClientToServerEvents): Promise<void>{
        return new Promise<void>( (resolve, reject) => {
            socketRef.current?.emit(event);
            resolve();
        })
    }

    function _validMessage(player_message: string): boolean {
        if (player_message.trim() !== '') return true;
        setErrorToast("Cannot send an empty message.");
        return false;
    }

    function _swapCharacter() {
        const player = config.player_i(player_i);
        const [from, to] = [config.characters[player.character].name, config.characters[flip(player.character)].name]
        player.setCharacter(c => flip(c));
    }

    function _nextTurn() {
        config.turn.set(turn => flip(turn));
    }

    function _resetPlayerInput() {
        input_fields[player_i][0].current = "";
        input_fields[player_i][1].current?.refresh();
    }

    function _setLastMessageSwitched() {
        const switchState = !messages.slice(-1)[0]?.switched;
        setMessages((prevMessages) => {
            console.log("state prev messages: ", prevMessages);
            const lastMessage = prevMessages.slice(-1)[0];
            lastMessage.switched = switchState;
            // return [...prevMessages];
            return prevMessages;
        });
    }

    function renderRoom(full: boolean) {
        if (full) {
            return <h3 className='text-center text-2xl font-bold'>Room {props.roomNumber} is full</h3>
        } else {
            return (
                <>
                    <h3 className='text-center text-2xl font-bold'>Room {props.roomNumber}</h3>
                    {errorToast && <ErrorToast message={errorToast} />}
                    <ChatBox messages={messages} />
                    <Controls
                        sendMessage={sendMessage}
                        switchRoles={()=>emit("swapRole").then(switchRoles)}
                        // endChat={endChatButton}
                        endChat={()=>emit("endChat").then(endChat)}
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
                </>
            )
        }
    }

    return (
        <div className="flex flex-col h-full w-full min-h-fit">
            {renderRoom(roomFull)}
        </div>
    );
};