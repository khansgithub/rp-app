"use client";

import React, { useRef, useState, type RefObject } from 'react';
import ChatBox from './components/ChatBox';
import Controls from './components/Controls';
import PlayerPanel from './components/PlayerPanel';
import type { Cfg, Data, Message, Player, RefreshRef } from '../../types';
import { flip_0_1 } from '../../util';
import { ErrorToast } from './components/ErrorToast';

import { usePathname } from 'next/navigation';

const App = (props: {roomNumber: string}) => {
    // console.log(params.roomNumber);
    const Names = ["A", "B"];
    const data: Data = {
        players: Array.from({ length: 2 }, (_, i) => {
            const [v, setter] = useState<0 | 1>(i as 0 | 1);
            return {
                name: Names[i],
                character: v,
                setCharacter: setter
            };
        }) as [Player, Player],
        characters: [
            { name: 'Host', colour: '#CAF4EC' },
            { name: 'Guest', colour: '#FED2D8' }
        ]
    };

    const [messages, setMessages] = useState<Message[]>([]);
    var [turn, setTurn] = useState<0 | 1>(0);

    const cfg: Cfg = {
        players: data.players,
        characters: data.characters,
        player1: data.players[0],
        player2: data.players[1],
        character1: data.characters[0],
        character2: data.characters[1],
        player_i: (i: 0 | 1) => data.players[i],
        character_i: (i: 0 | 1) => data.characters[i],
        turn: { value: turn, set: setTurn }
    };

    var [errorToast, setErrorToast] = useState(false);
    var errorToastMessage = "";

    const input_fields = [
        [useRef(""), useRef<RefreshRef>(null)],
        [useRef(""), useRef<RefreshRef>(null)]
    ] as const;

    const sendMessage = () => {
        const player_i = cfg.turn.value;
        const player_message = input_fields[player_i][0].current;

        if (player_message.trim() === '') {
            setErrorToast(true);
            errorToastMessage = "Cannot send an empty message.";
            return;
        }

        const player = cfg.player_i(player_i);
        const character = cfg.character_i(player.character);
        const newMessage: Message = {
            player: player,
            text: player_message,
            character: character,
            switched: false,
            timestamp: new Date().toLocaleTimeString()
        };

        const nextPlayer_i = 1 - player_i as 0 | 1;
        setMessages((prev) => [...prev, newMessage]);
        input_fields[player_i][0].current = "";
        input_fields[player_i][1].current?.refresh();
        cfg.turn.set(nextPlayer_i);
    };

    const switchRoles = () => {
        const turn = cfg.turn.value;
        const player = cfg.player_i(turn);
        const otherPlayer = cfg.player_i(flip_0_1(turn));
        const switchState = !messages.slice(-1)[0]?.switched;
        otherPlayer.setCharacter(player.character);
        player.setCharacter(flip_0_1(player.character));
        setMessages((prevMessages) => {
            const lastMessage = prevMessages.slice(-1)[0];
            if (lastMessage) lastMessage.switched = switchState;
            return [...prevMessages];
        });
    };

    const endChat = () => {
        setMessages([]);
    };

    return (
        <div className="flex flex-col h-full w-full">
            <h3 className='text-center text-2xl font-bold'>Room {props.roomNumber}</h3>
            {errorToast && <ErrorToast message={errorToastMessage} />}
            <ChatBox messages={messages} />
            <Controls
                sendMessage={sendMessage}
                switchRoles={switchRoles}
                endChat={endChat}
            />
            <div className="flex justify-between mt-5">
                {[0, 1].map((i) => (
                    <PlayerPanel
                        key={i}
                        player={cfg.players[i]}
                        message={input_fields[i][0] as RefObject<string>}
                        ref={input_fields[i][1] as RefObject<RefreshRef>}
                        sendMessage={sendMessage}
                        cfg={cfg}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
