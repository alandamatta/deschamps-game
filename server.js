import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import createGame from './public/game.js';


const app = express();

const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe(command => {
	sockets.emit(command.type, command);
});

sockets.on('connect', socket => {
	const playerId = socket.id;

	const player = {
		playerId: socket.id
	};

	game.addPlayer(player);

	socket.emit('setup', game.state);

	socket.on('disconnect', () => {
		game.removePlayer({playerId: socket.id});
	});

	socket.on('move-player', command => {
		command.playerId = playerId;
		command.type = 'move-player';
		game.movePlayer(command);
	});

});

sockets.on('disconnect', socket => {
	game.removePlayer({playerId: socket.id});
});

server.listen(process.env.PORT || 3000, () => {
	console.log('> Server is listening');
});
