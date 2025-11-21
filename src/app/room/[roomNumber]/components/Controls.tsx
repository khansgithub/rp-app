import React, { MouseEventHandler } from 'react';

interface ControlsProps {
    sendMessage: (event: React.MouseEvent<HTMLButtonElement>) => void;
    switchRoles: () => void;
    endChat: () => void;
}

const Controls: React.FC<ControlsProps> = ({ sendMessage, switchRoles, endChat }) => {
    const css = {
        button: "px-4 py-2.5 rounded-md border border-gray-300 bg-blue-600 text-white cursor-pointer transition-colors duration-300 hover:bg-blue-800"
    }
    const buttons: [string, MouseEventHandler<any>][] = [
        ["Send", sendMessage],
        ["Switch", switchRoles],
        ["End", endChat],
    ];
    return (
        <div className="flex justify-between gap-2">
            {buttons.map((button, i) => {
                return (
                    <button key={i} onClick={button[1]} className={css.button}>
                        {button[0]}
                    </button>
                )
            })}
        </div>
    );
};

export default Controls;
