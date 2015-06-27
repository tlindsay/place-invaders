//  ____  _                ___                     _               
// |  _ \| | __ _  ___ ___|_ _|_ ____   ____ _  __| | ___ _ __ ___ 
// | |_) | |/ _` |/ __/ _ \| || '_ \ \ / / _` |/ _` |/ _ \ '__/ __|
// |  __/| | (_| | (_|  __/| || | | \ V / (_| | (_| |  __/ |  \__ \
// |_|   |_|\__,_|\___\___|___|_| |_|\_/ \__,_|\__,_|\___|_|  |___/                                                                
///////////////////////////////////////////////////////////////////////                                                                  
// Author: Patrick Lindsay

;(function () {

	window.addEventListener('load', function() {
		document.getElementById('place-invaders').addEventListener('click', function() {
			window.theGame = new Game();
		});
	});

	var Game = function() {
		console.info('Welcome to Place Invaders');

		var self = this;

		var canvas   = document.getElementById('place-invaders');
		var screen   = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height };

		this.gameSize = gameSize;
		this.gameOver = false;
		this.win 	  = false;
		this.bodies	  = [];
		this.bodies.push(new Player(this));

		spawnInvaders(this);

		var tick = function() {
			document.getElementById('fps').innerHTML = countFPS();
			self.update();
			self.draw(screen, self.gameSize);
			requestAnimationFrame(tick);
		};

		tick();
	};

	Game.prototype = {
		update : function() {
			var self = this;

			var notCollidingWithAnything = function(b1) {
				return self.bodies.filter(function(b2){ return colliding(b1, b2); }).length === 0;
			};

			this.bodies = this.bodies.filter(notCollidingWithAnything); // Delete all colliding bodies

			for(var body in this.bodies) {
				this.bodies[body].update();
			}
		},

		draw : function(screen, gameSize) {
			screen.clearRect(0, 0, gameSize.x, gameSize.y);

			for(var body in this.bodies) {
				drawRect(screen, this.bodies[body]);
			}
		},

		addBody : function(body) {
			this.bodies.push(body);
		}
	};

	// The thing that the player controls
	var Player = function(game) {
		this.game   = game;
		this.size   = { x: 15, y: 15 };
		this.center = { x: this.game.gameSize.x / 2, y: this.game.gameSize.y - 30 };

		// Handling keyboard input.
		this.keyboarder = new Keyboarder();
	};

	Player.prototype = {
		update : function() {
			if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT))
				this.center.x -= 5; // Moving left
			else if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT))
				this.center.x += 5; // Moving right

			// PEW PEW PEW PEW PEW PEW PEW PEW PEW PEW PEW PEW PEW........ PEW
			if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE))
				this.game.addBody(new Bullet(this.game, this.center.x, this.center.y - this.size.y));
		}
	};

	// Bad dudes
	var Invader = function(game, x, y) {
		this.game   = game;
		this.size   = { x: 15, y: 15 };
		this.center = { x: x, y: y };
	};

	Invader.prototype = {
		// Bad dudes do stuff, too
		update : function() {

		}
	};

	// PEW PEW PEW
	var Bullet = function(game, x, y) {
		this.game   = game;
		this.size   = { x: 1, y: 4 };
		this.center = { x: x, y: y };
		this.speed  = 3;
	};

	Bullet.prototype = {
		update : function() {
			// It upgoes
			this.center.y -= this.speed;
		}
	};

	// They're invading our places!!
	var spawnInvaders = function(game) {
		// Complicated mathy stuff that puts them in a grid.
		for(x=25; x<385; x+=20) {
			for(y=25; y<300; y+=20) {
				game.addBody(new Invader(game, x, y));
			}
		}
	};

	// Clickety clack
	var Keyboarder = function() {
		var keystate = {};

		// For when you are pushing things.
		window.addEventListener('keydown', function(e) {
			keystate[e.keyCode] = true;
		});

		// For when you are NOT pushing things.
		window.addEventListener('keyup', function(e) {
			keystate[e.keyCode] = false;
		});

		// For which things you are pushing.
		this.isDown = function(keyCode) {
			return keystate[keyCode] === true;
		};

		// Hooray for readability!
		this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
	};

	// Can I draw you?
	var drawRect = function(screen, body) {
		screen.fillRect(body.center.x - body.size.x / 2,
						body.center.y - body.size.y / 2,
						body.size.x,
						body.size.y);
	};

	var colliding = function(b1, b2) {
    	return !(
      		b1 === b2 ||
        	b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        	b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        	b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        	b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    	);
  	};

	window.countFPS = (function () {
		var lastLoop = (new Date()).getMilliseconds();
		var count = 1;
		var fps = 0;

		return function () {
			var currentLoop = (new Date()).getMilliseconds();
			if (lastLoop > currentLoop) {
				fps = count;
				count = 1;
			} else {
				count += 1;
			}
			lastLoop = currentLoop;
			return Math.floor(fps);
		};
	}());
})();