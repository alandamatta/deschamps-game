export default function createGame() {

	const state = {
		players: {},
		fruits: {},
		screen: {
			width: 30,
			height: 30
		}
	};

	const observables = [];

	function start() {
		setInterval(addFruit, 4000);
	}

	function subscribe(observerFunction) {
		observables.push(observerFunction);
	}

	function notifyAll(command) {
		observables.forEach(observableFunction => observableFunction(command));
	}

	function setState(newState) {
		Object.assign(state, newState);
	}

	function addPlayer(command) {
		const playerId = command.playerId;
		const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
		const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);
		const type = 'add-player';
		const score = 0;
		state.players[playerId] = {
			x: playerX,
			y: playerY,
			score
		};

		notifyAll({
			type,
			playerId,
			playerX,
			playerY,
			score
		});

	}

	function removePlayer(command) {
		const type = 'remove-player';
		const playerId = command.playerId;
		delete state.players[playerId];
		notifyAll({
			type,
			playerId
		});
	}

	function addFruit(command) {
		if (Object.keys(state.players).length > 0) {
			const fruitId = command && command.fruitId ? command.fruitId : Math.floor(Math.random() * 1000);
			const fruitX = command && 'fruitX' in command ?
				command.fruitX : Math.floor(Math.random() * state.screen.width);
			const fruitY = command && 'fruitY' in command ?
				command.fruitY : Math.floor(Math.random() * state.screen.height);
			const type = 'add-fruit';

			state.fruits[fruitId] = {
				x: fruitX,
				y: fruitY
			};

			notifyAll({
				type,
				fruitId,
				fruitX,
				fruitY
			});
		}
	}

	function removeFruit(command) {
		const fruitId = command.fruitId;
		delete state.fruits[fruitId];
	}

	function movePlayer(command) {
		notifyAll(command);
		const keyPressed = command.keyPressed;
		const player = state.players[command.player];

		const acceptedMoves = {
			ArrowUp(player) {
				player.y = Math.max(player.y - 1, 0);
			},
			ArrowDown(player) {
				player.y = Math.min(player.y + 1, state.screen.height - 1);
			},
			ArrowLeft(player) {
				player.x = Math.max(player.x - 1, 0);
			},
			ArrowRight(player) {
				player.x = Math.min(player.x + 1, state.screen.width - 1);
			}
		};

		const moveFunction = acceptedMoves[keyPressed];

		if (moveFunction && player) {
			moveFunction(player);
			checkForFruitCollision(player);
		}

	}

	function checkForFruitCollision(player) {
		const playerX = player.x;
		const playerY = player.y;
		let fruit;
		for (let fruitId in state.fruits) {
			fruit = state.fruits[fruitId];
			if (playerX === fruit.x && playerY === fruit.y) {
				removeFruit({fruitId});
				addPointToThePlayer(player);
			}
		}

	}

	function addPointToThePlayer(player) {
		player.score++;
		const type = 'players-score-update';
		// state.players[player.playerId] = player;
		// console.log('add point to this player: ', player.playerId);
		notifyAll({
			type,
			player
		});
	}

	return {
		movePlayer,
		state,
		addPlayer,
		removePlayer,
		addFruit,
		removeFruit,
		setState,
		subscribe,
		start
	};
}
