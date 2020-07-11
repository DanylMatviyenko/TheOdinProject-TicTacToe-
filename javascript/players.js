const Player = function(name, point) {
		const newPlayer = Object.create(null);
		newPlayer.point = point;
		newPlayer.name = name;

		return newPlayer;
};
const Robot = function(name, point) {
	const newRobot = Player(name, point);

	newRobot.autostep = true;
	let aiPlayer = "O";
	let huPlayer = "X";
	newRobot.pickSquare = function(boardArr, scoreArray, player = "O") {
		const emptyIndexes = function(boardArr) {
			return boardArr.filter(elem => typeof elem === 'number');
		};

		const availSpots = emptyIndexes(boardArr);

		if(gameBoardModule.checkWinner(scoreArray) === 3) {
			return {score: -10};
		}else if(gameBoardModule.checkWinner(scoreArray) === -3) {
			return {score: 10};
		}else if(availSpots.length === 0) {
			return {score: 0};
		}
		const moves = [];
		const point = player === aiPlayer ? -1 : 1;

		for(let freeIdx of availSpots) {
			const move = {};

			move.index = boardArr[freeIdx];
			boardArr[freeIdx] = player;
			
			const col = freeIdx % gameBoardModule.gridSize;
			const row = (freeIdx - col) / gameBoardModule.gridSize;
			scoreArray = gameBoardModule.changeScore(row, col, point,scoreArray);

			if(player === aiPlayer) {
				const result = this.pickSquare(boardArr, scoreArray, huPlayer);
				move.score = result.score;
			}else {
				const result = this.pickSquare(boardArr, scoreArray, aiPlayer);
				move.score = result.score;
			}

			boardArr[freeIdx] = move.index;
			scoreArray = gameBoardModule.changeScore(row, col, -point,scoreArray);


			moves.push(move);
		}

		let bestMove;

		if(player === aiPlayer) {
			let bestScore = -Infinity;
			for(let i = 0; i < moves.length; i++) {
				if(moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}else {
			let bestScore = +Infinity;
			for(let i = 0; i < moves.length; i++) {
				if(moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}

		return moves[bestMove];
	};

	return newRobot;
};
