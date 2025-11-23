import { Message, Player } from "@/app/types";

export interface ClientToServerEvents {
    chatMessage: (
        msg: Message,
        // player: typeof config.players[number]['name'],
        // character: typeof config.characters[number]['name']
    ) => void;
    swapCharacter: () => void;
}

export interface ServerToClientEvents {
    chatMessage: (msg: Message) => void;
    swapCharacter: () => void;
    setTurn:(turn: 0 | 1) => void;
    text: (text: string) => void;
}

export interface SocketProperties {
    player_number: 0 | 1;
}