export default function ui(document, players) {
	function scoreRow(players) {
		var html = ``;
		for (let player in players) {
			if (player) {
				html += `
				<tr>
					<th scope="row">${player}</th>
					<th>${players[player].score}</th>
				</tr>
				`;
			}
		}
		return html;
	}

	function updateScore(players) {
		console.log('updateScore', players);
		document.getElementById('score').innerHTML = scoreRow(players);
	}

	return {
		updateScore
	}

}
