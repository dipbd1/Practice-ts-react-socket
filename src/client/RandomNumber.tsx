import React, { SyntheticEvent, useState, useEffect } from 'react';

import { Socket } from 'socket.io';

interface IProps {
	socket : Socket;
}

const RanddomNumber = ({socket}: IProps) => {
    let [rnumber, setRnumbr] = useState(0);
	useEffect(() => {
	}, [socket]);
	socket.on('rnumEmit', (value: number) => {
		setRnumbr(value);
	});
    return (
        <div>
            <span>{rnumber}</span>
            <button
                onClick={() => {
					socket.emit('random');
                }}>Press Me :)</button>
        </div>
    );
};

export default RanddomNumber;