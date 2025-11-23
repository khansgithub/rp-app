import React from 'react';
import type { Character, Player } from '@/app/types';

interface MessageProps {
	message: {
		player?: Player;
		text: string;
		character: Character;
		switched: boolean;
		timestamp: string;
	};
}

const Message: React.FC<MessageProps> = ({ message }) => {
	return (
		<div
			className={`p-2.5 rounded-lg wrap-break-word transition-colors duration-300 text-black border-gray-700 dark:border-gray-200 ${message.switched ? 'dark:bg-gray-400! bg-gray-200!  border-gray-300 border-1' : ''}`}
			style={{ backgroundColor: message.character.colour }}
		>
			<div className="text-base">{message.text}</div>
			<div className="text-sm text-right text-gray-600">
				{message.character.name} (<em>{message.player?.name}</em>) <span>{message.timestamp}</span>
			</div>
		</div>
	);
};

export default Message;
