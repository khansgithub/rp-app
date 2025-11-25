import { Message, Player } from "@/app/types";

export interface Shared {
    swapCharacter: () => void;
    swapRole: () => void;
    endChat: () => void;    
}

export interface ClientToServerEvents extends Shared {
    chatMessage: (
        msg: Message,
    ) => void;
}

export interface ServerToClientEvents extends Shared {
    chatMessage: (msg: Message) => void;
    setTurn: (turn: 0 | 1) => void;
    roomFull: (roomSize?: number, cb?: ()=>void) => void;
    text: (text: string) => void;
}

export interface SocketProperties {
    player_number: 0 | 1;
}