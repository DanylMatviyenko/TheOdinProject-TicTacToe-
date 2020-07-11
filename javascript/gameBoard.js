const gameBoardModule = (function () {
	//cache DOM
	const _tdSquares = document.querySelectorAll('.board-table__td');
	const _boardTable = document.querySelector('.board-table');
	const _gameBoard = document.querySelector('.gameboard');
	
	let _currentPlayer;
	let _winnerTextContainer;
	let _gameMovesCounter = 0;


	const gridSize = Math.sqrt(_tdSquares.length);
	//score arrays
	let _scoreArray = new Array(gridSize*2 + 2);
	_scoreArray.fill(0);

	let _freeSq = Array.from(Array(_tdSquares.length).keys());


	//restart game
	const restartGame = function () {
		_scoreArray.fill(0);
		_gameMovesCounter = 0;
		_currentPlayer = undefined;
		_freeSq = Array.from(Array(_tdSquares.length).keys());
		for(let td of _tdSquares) {
			td.innerHTML = '';
		}
		if(document.querySelector('.winner-text')) {
			document.querySelector('.winner-text').remove();
			_boardTable.removeEventListener('animationend', _boardAnimationEnd);
			_boardTable.classList.remove('board-table_animation_remove');
			_boardTable.classList.remove('board-table_display_none');
		}
	};
	//change array for robostep
	const _changeRoboArray = function(tdIdx, freeSq) {
		freeSq = freeSq.map(idx => {
			if(idx === tdIdx) {
				return _currentPlayer === gameLoop.firstPlayer ? "X" : "O";
			}
			return idx;
		});

		return freeSq;
	};
	//change content cell
	const _fillBoard = function(tdIdx, point) {
		let icon;
		if(point === 1) {
			icon = document.querySelector('.cross').cloneNode(true);
			icon.classList.remove('cross_display_none');
		}else {
			icon = document.querySelector('.circle').cloneNode(true);
			icon.classList.remove('circle_display_none');
		}
		_tdSquares[tdIdx].append(icon);
	};
	//change score
	const changeScore = function (row, col, point, _scoreArray) {
		_scoreArray[row] += point;
		_scoreArray[gridSize + col] += point;
		if(row === col) {
			_scoreArray[gridSize*2] += point;
		}
		if(gridSize - 1 - col === row) {
			_scoreArray[gridSize*2 + 1] += point;
		}
		return _scoreArray;
	};
	//
	const _boardAnimationEnd = function () {
		_boardTable.classList.add('board-table_display_none');
		_gameBoard.prepend(_winnerTextContainer);
		};
	//show winner of the round
	const _showWinner = function(tie = false) {
		//block next robostep
		_freeSq = [];

		_boardTable.classList.add('board-table_animation_remove');
		_boardTable.addEventListener('animationend', _boardAnimationEnd); 
		_winnerTextContainer = document.createElement('div');
		_winnerTextContainer.classList.add('winner-text');
		if(!tie) {
		_winnerTextContainer.innerHTML = 
		`
			<h1 class="h1">${_currentPlayer.name}</h1>
			<p class="winner-text__paragraph">Winner!</p>
		`;
		}else {
			_winnerTextContainer.innerHTML = 
		`
			<h1 class="h1">It's a tie</h1>
			<p class="winner-text__paragraph">Game!</p>
		`;
		}
		
	};
	//check Winner
	const checkWinner = function () {
		for(let score of _scoreArray) {
			if(score === 3 || score === -3) {
				return score;
			}
		}
		return false;
	};
	
	//make a step by robot
		const _stepByRobot = function() {
			const clickIdx = gameLoop.secondPlayer.pickSquare(_freeSq, _scoreArray);
			_tdSquares[clickIdx.index].click();
		};
	//table manipulation on DOM
	const _tableGameMove = function (event) {
		const target = event.target.closest('td');


		if(!target) return;
		if(target.innerHTML !== '') return;
		const clickedTdIndex = (target.parentElement.rowIndex * 3) + target.cellIndex;

		_currentPlayer =  _currentPlayer === gameLoop.secondPlayer ||
		 typeof _currentPlayer === 'undefined' ? gameLoop.firstPlayer : gameLoop.secondPlayer;
		
		_fillBoard(clickedTdIndex, _currentPlayer.point);
		_freeSq = _changeRoboArray(clickedTdIndex, _freeSq);
		_scoreArray = changeScore(target.parentElement.rowIndex, target.cellIndex, _currentPlayer.point, _scoreArray);
		_gameMovesCounter += 1;
		if(checkWinner()) {
			_showWinner();
		}else if(_gameMovesCounter === 9) {
			_showWinner(true);
		}
		if(_currentPlayer === gameLoop.firstPlayer && gameLoop.secondPlayer.autostep && _freeSq.length !== 0) {
			_stepByRobot();
		}
	};

	_boardTable.onclick = _tableGameMove;
	return {restartGame, checkWinner, changeScore, gridSize};
})();
