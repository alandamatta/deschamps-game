export default function createKeyboardListener(document) {
	const state = {
		observables: [],
		playerId: null
	};

	function registerPlayer(playerId) {
		state.playerId = playerId;
	}

	function subscribe(observerFunction) {
		state.observables.push(observerFunction);
	}

	function notifyAll(command) {
		state.observables.forEach(observableFunction => observableFunction(command));
	}

	function handleKeydown(event) {
		const keyPressed = event.key;

		const command = {
			player: state.playerId,
			keyPressed
		};

		notifyAll(command);
	}

	document.addEventListener('keydown', handleKeydown);

	return {
		subscribe,
		notifyAll,
		registerPlayer
	}

}
