import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const messageExpirationTimeMS = 10 * 1000;

export interface IUser {
    id: string;
    name: string;
}

const defaultUser: IUser = {
    id: 'anon',
    name: 'Anonymous',
};

export interface IMessage {
    user: IUser;
    id: string;
    time: Date;
    value: string;
}

const sendMessage = (socket: Socket | Server) => (message: IMessage) => socket.emit('message', message);

export default (io: Server) => {
	const messages: Set<IMessage> = new Set();
	let rnum: number = 0;

    io.on('connection', (socket) => {
        socket.on('getMessages', () => {
            messages.forEach(sendMessage(socket));
        });

        socket.on('message', (value: string) => {
            const message: IMessage = {
                id: uuidv4(),
                time: new Date(),
                user: defaultUser,
                value,
            };

            messages.add(message);

            sendMessage(io)(message);

            setTimeout(() => {
                messages.delete(message);
                io.emit('deleteMessage', message.id);
            }, messageExpirationTimeMS);
		});
		
		socket.on('random',()=>{
			console.log('got a hit');
			rnum = Math.random();
			io.emit('rnumEmit', rnum);
		} )
    });
};
