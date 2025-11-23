import { Config, Character, Data, Player } from "@/app/types";
import { useState } from "react";

export const names = ["A", "B"] as const;

const Characters: [Character, Character] = [
    { name: 'Host', colour: '#CAF4EC' },
    { name: 'Guest', colour: '#FED2D8' }
] as const;

export function getConfig(): Config {
    const [turn, setTurn] = useState<0 | 1>(0);

    const Players: [Player, Player] = Array.from({ length: 2 }, (_, i) => {
        const [v, setter] = useState<0 | 1>(i as 0 | 1);
        return {
            name: names[i],
            character: v,
            setCharacter: setter
        };
    }) as [Player, Player];

    return {
        players: Players,
        player1: Players[0],
        player2: Players[1],
        player_i: (i: 0 | 1) => Players[i],

        characters: Characters,
        character1: Characters[0],
        character2: Characters[1],
        character_i: (i: 0 | 1) => Characters[i],

        turn: { value: turn, set: setTurn }
    };
}