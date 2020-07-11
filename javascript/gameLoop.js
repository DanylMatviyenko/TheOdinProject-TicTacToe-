/*jshint esversion:6*/
const gameLoop = (function () {
	const _playerMenu = document.querySelector('.players-info');
	const _aiCheckbox = document.querySelector('.players-form__checkbox');
	let firstPlayer,secondPlayer, _playerNames;

	const _removeShadow = function() {
		this.style.boxShadow = 'none';
	};
	//create players/robot
	const _createPlayers = function() {
		gameLoop.firstPlayer = Player(_playerNames[0].value, 1);
		if(_playerNames.length === 2) {
			gameLoop.secondPlayer = Player(_playerNames[1].value, -1);
		}else {
			gameLoop.secondPlayer = Robot('AI', -1);
		}
	};
	//check player's names, each of them must have name 
	const _checkInputValues = function() {
		let allFilled = true;

		for(let input of _playerNames) {
			if(input.value === '') {
				allFilled = false;
				input.classList.add('players-form__name-input_box-shdow_red');
				input.onfocus = _removeShadow;
			}
		}
		return allFilled;
	};
	//remove player-menu after entering name(s)
	const _removePlayerMenu = function() {
		_playerMenu.removeEventListener('keydown', _sendFormOnEnter);
		_playerMenu.remove();
	};
	const _gameStartHandler = function (event) {
		const button = event.target.closest('button');

		if(!button) return;

		if(!button.classList.contains('gameloop-button')) return;

		_playerNames = document.querySelectorAll('.players-form__name-input[data-active="true"]');
		if(button.dataset.action === 'start' && _checkInputValues()) {
			_createPlayers();
			_playerMenu.style.top = _playerMenu.offsetTop + 'px';
			_playerMenu.addEventListener('transitionend', _removePlayerMenu);
			_playerMenu.style.top = -_playerMenu.offsetHeight + 'px';
		}else if(button.dataset.action === 'restart') {
			gameBoardModule.restartGame();
		}

	};

	const _sendFormOnEnter = function(event) {
		const target = event.target.closest('input');
		if(!event.target.classList.contains('players-form__name-input')) return;
		if(event.key !== 'Enter') return;

		_playerMenu.querySelector('.gameloop-button').click();
	};
	//hide second player on active checkbox
	const _checkboxHandler = function () {
		const secondInput = document.querySelector('.players-form__label-second-player input');
		document.querySelector('.players-form__label-second-player').classList.
		toggle('players-form__label-second-player_visability_hidden');

		secondInput.dataset.active = !secondInput.dataset.active;
		_playerNames = document.querySelectorAll('.players-form__name-input[data-active="true"]');
	};

	document.addEventListener('click', _gameStartHandler);
	_playerMenu.addEventListener('keydown', _sendFormOnEnter);
	_aiCheckbox.addEventListener('change', _checkboxHandler);
	return {firstPlayer, secondPlayer};
})();