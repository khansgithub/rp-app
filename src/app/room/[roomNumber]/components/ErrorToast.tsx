import React, { useEffect, useState } from 'react';

type ErrorToastProps = {
	message: string;
	duration?: number;
	onClose?: () => void;
};

export const ErrorToast: React.FC<ErrorToastProps> = ({
	message,
	duration = 3000,
	onClose,
}) => {
	const [visible, setVisible] = useState(false);
	const [hover, setHover] = useState(false);

	useEffect(() => {
		setVisible(true);
		if (!hover) {
			const timer = setTimeout(() => {
				setVisible(false);
				setTimeout(() => onClose?.(), 400); // allow fade-out
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, hover, onClose]);

	if (!visible) return null;

	return (
		<div
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className={`
				fixed bottom-5 right-5 
				bg-gradient-to-br from-red-400 to-red-600 
				text-white px-5 py-3 
				rounded-xl shadow-lg 
				font-sans min-w-[200px] max-w-[400px] 
				flex justify-between items-center 
				cursor-pointer z-[9999]
				transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
				${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
			`}
		>
			<span>{message}</span>
			<button
				onClick={() => {
					setVisible(false);
					setTimeout(() => onClose?.(), 400);
				}}
				className="ml-4 text-white text-lg leading-none cursor-pointer hover:opacity-80 transition-opacity"
				aria-label="Close toast"
			>
				×
			</button>
		</div>
	);
};
