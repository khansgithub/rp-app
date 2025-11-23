export type Character = {
    name: string,
    colour: string
};

export type Player = {
    name: string;
    character: 0 | 1;
    setCharacter: React.Dispatch<React.SetStateAction<0 | 1>>;
}

export interface Message {
    player: Player;
    text: string;
    character: Character;
    switched: boolean;
    timestamp: string;
}

export interface Data {
    players: [Player, Player];
    characters: [Character, Character]
}

export interface Config {
    players: [Player, Player];
    characters: [Character, Character];
    player1: Player;
    player2: Player;
    character1: Character;
    character2: Character;
    player_i: (i: 0 | 1) => Player;
    character_i: (i: 0 | 1) => Character;
    turn: {
        value: 0 | 1;
        set: React.Dispatch<React.SetStateAction<0 | 1>>;
    };
}

export interface RefreshRef {
    refresh: () => void;
}

export type Rooms = Map<string, {count: 1 | 2}>;