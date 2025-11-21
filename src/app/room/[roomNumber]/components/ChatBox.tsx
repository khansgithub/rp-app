import React, { useEffect, useRef } from 'react';
import Message from './Message';
import type { Character } from '@/app/types';

interface ChatBoxProps {
	messages: {
		text: string;
		character: Character;
		switched: boolean;
		timestamp: string;
	}[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="flex flex-col grow overflow-y-auto p-4 rounded-lg border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 mb-2.5 gap-2.5"
		>
			{messages.map((msg, index) => (
				<Message key={index} message={msg} />
			))}
		</div>
	);
};

export default ChatBox;
