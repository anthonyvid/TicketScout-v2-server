// socket.js
import { Server } from "socket.io";

let io;

const handleTestEvent = (socket, data) => {
	console.log(data);
};

const handleDisconnectEvent = (socket) => {
	console.log("User disconnected");
};

const initSocketIo = (server) => {
	try {
		const ioInstance = new Server(server, {
			cors: {
				origin: "http://localhost:3000",
			},
		});
		io = ioInstance;

		io.on("connection", (socket) => {
			socket.on("test", (data) => handleTestEvent(socket, data));
			socket.on("disconnect", () => handleDisconnectEvent(socket));
		});
	} catch (error) {
		console.error(error);
	}
};

export { initSocketIo, io };
