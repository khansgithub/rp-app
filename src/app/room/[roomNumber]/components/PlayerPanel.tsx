import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	memo,
	useEffect,
} from 'react';
import type { Cfg, Player, RefreshRef } from '@/app/types';
import { flip_0_1 } from '@/app/util';

interface PlayerPanelProps {
	player: Player;
	message: React.RefObject<string>;
	cfg: Cfg;
	sendMessage: () => void;
}

const PlayerPanel = memo(
	forwardRef<RefreshRef, PlayerPanelProps>((props, ref) => {
		const inputRef = useRef<HTMLInputElement>(null);

		useImperativeHandle(ref, () => ({
			refresh() {
				if (inputRef.current) inputRef.current.value = '';
			},
		}));

		const player = props.cfg.player_i(props.cfg.turn.value);
		const myTurn = player.name === props.player.name;
		const character = props.cfg.characters[player.character];
		const characterName = myTurn
			? character.name
			: props.cfg.characters[flip_0_1(player.character)].name;
		const characterColour = character.colour;

		useEffect(() => {
			if (myTurn) inputRef.current?.focus();
		}, [myTurn]);

		const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				props.sendMessage();
			}
		};

		return (
			<div
				className={`flex flex-col justify-center items-center p-3 w-5/12 rounded-lg transition-colors duration-300 dark:saturate-200 ${myTurn ? 'border' : 'saturate-0!'}`}
				style={{ backgroundColor: characterColour }}
			>
				<div className="text-center mb-2 dark:text-black">
					<p className="font-semibold">{props.player.name}</p>
					<p className="font-normal">{characterName}</p>
				</div>
				<input
					autoFocus={myTurn}
					ref={inputRef}
					type="text"
					onChange={(e) => (props.message.current = e.target.value)}
					onKeyDown={enter}
					placeholder={`${props.player.name} types here!`}
					disabled={!myTurn}
					className={`p-2.5 rounded-md border border-gray-300 dark:border-gray-600 w-11/12 ${myTurn ? 'bg-white dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`}
				/>
			</div>
		);
	}),
	(prevProps, nextProps) => {
		const same_turn = prevProps.cfg.turn.value === nextProps.cfg.turn.value;
		const not_switched =
			prevProps.player.character === nextProps.player.character;
		const rerender = !same_turn || !not_switched;
		return !rerender;
	}
);

export default PlayerPanel;
