export default function ui(document) {
	function scoreRow(players, playerId) {
		var clazz;
		var html = ``;
		for (let player in players) {
			console.log('player', clazz = players[playerId]);
			clazz = player === playerId ? 'pink' : 'grey';
			if (player) {
				html += `
				<tr class="${clazz}">
					<th scope="row">${player}</th>
					<th>${players[player].score}</th>
				</tr>
				`;
			}
		}
		return html;
	}

	function updateScore(players, playerId) {
		document.getElementById('score').innerHTML = scoreRow(players, playerId);
	}

	return {
		updateScore
	}

}
