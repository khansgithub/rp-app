import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	memo,
	useEffect,
} from 'react';
import type { Config, Player, RefreshRef } from '@/app/types';
import { flip } from '@/app/util';
import { useUserStore } from '@/app/store/store';

interface PlayerPanelProps {
	player: Player;
	message: React.RefObject<string>;
	config: Config;
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

		const player = props.player;
		const myTurn = props.config.turn.value == player.character;
		const character = props.config.characters[player.character];
		const characterName = props.config.character_i(player.character).name;
		const characterColour = character.colour;
    	const { playerName } = useUserStore();

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
				className={`p-3 grow flex flex-col justify-center items-center rounded-lg transition-colors duration-300 dark:saturate-200 border ${myTurn ? 'dark:border-gray-500 border-gray-400' : 'dark:bg-gray-400! bg-gray-300! dark:border-gray-700 border-gray-100'}`}
				style={{ backgroundColor: characterColour }}
			>
				<div className="text-center mb-2 dark:text-black">
					<p className="font-semibold">{playerName}</p>
					<p className="font-normal">{characterName}</p>
				</div>
				<input
					autoFocus={myTurn}
					ref={inputRef}
					type="text"
					onChange={(e) => (props.message.current = e.target.value)}
					onKeyDown={enter}
					placeholder={`${playerName} types here!`}
					disabled={!myTurn}
					className={`p-2.5 rounded-md border border-gray-300 dark:border-gray-600 w-11/12 ${myTurn ? 'bg-white dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`}
				/>
			</div>
		);
	}),
	// prevents the component from being re-rendered (forgot what state value triggered this)
	(prevProps, nextProps) => {
		// const same_turn = prevProps.config.value === nextProps.config.value;
		// const not_switched =
		// 	prevProps.player.character === nextProps.player.character;
		// const rerender = !same_turn || !not_switched;
		// return !rerender;
		return false;
	}
);

export default PlayerPanel;
