var context;
var pacman = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;

var cnt;
var foodNum;
var pacman_remain;

let keyUp;
let keyDown;
let keyLeft;
let keyRight;

let boardWidth;
let boardHight;

let monstersSpeed;
let wallNum;
let monsterNum;
let monstersArr = new Array();
let pacmanDir;
let loopNum = 0; //time of the loop to execute
let lives;
let gameTime;

let movingScore;

let blackCandyCode = 1; //5 points candies
let pacCode = 2;
let monsterCode = 3;
let wallCode = 4;
let yellowCandyCode = 5; //15 points candies
let greenCandyCode = 6; //25 points candies
let lollipopCode = 7; //when eaten the monsters move slower for 5 seconds
let medicineCode = 8;

let startingBlackCandy;
let startingYellowCandy;
let startingGreenCandy;

//lollipop object
let lollipop = new Object(); //when eaten the monsters are slower
let isLollipopEaten = false; //the round in the loop the lollipop was eaten
let lollipopEatenTime;


// $(document).ready(function() {
// 	context = canvas.getContext("2d");
// 	Start();
// });

function startGame() {
	stopGame();
	//make game information visible
	$("#gameScreen > #gameLogic > #gameInformation").css("display", "block");
	$("#gameScreen > #gameLogic > #game > #canvas").css("border-style", "solid");
	pacmanMusic.play();
	context = canvas.getContext("2d");
	Start();
}

function stopGame() {
	//make game information invisible
	pacmanMusic.pause();
	$("#gameScreen > #gameLogic > #game > #canvas").css("border-style", "none");
	$("#gameScreen > #gameLogic > #gameInformation").css("display", "none");
	window.clearInterval(interval);
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function initGameSettings() {
	//board size settings
	boardWidth = 10;
	boardHeight = 10;

	//game settings
	wallNum = 4;
	monsterNum = $("#monstersNum").val();

	//keys
	keyUp = $("#keyUp").val();
	keyDown = $("#keyDown").val();
	keyRight = $("#keyRight").val();
	keyLeft = $("#keyLeft").val();


	lives = 5;
	// monstersSpeed = 3; //the one that the user will choose. can be from 1 to 10
	// monstersSpeed = 10 - monstersSpeed; //updating the monster speed
	monstersSpeed = 7;
	pacmanDir = "right";
	score = 0;
	pac_color = "yellow";
	cnt = 100;
	foodNum = $("#candyNum").val();
	gameTime = $("#gameTime").val();
	//get each candy type
	startingBlackCandy = Math.floor(foodNum * 0.6);
	startingYellowCandy = Math.floor(foodNum * 0.3);
	startingGreenCandy = Math.floor(foodNum * 0.1);



	pacman_remain = 1;
	start_time = new Date();
}

function putWalls(board) {
	board[5][0] = wallCode;
	board[5][1] = wallCode;
	board[0][5] = wallCode;
	board[1][5] = wallCode;
	board[5][board[0].length - 1] = wallCode;
	board[5][board[0].length - 2] = wallCode;
	board[board.length - 1][5] = wallCode;
	board[board.length - 2][5] = wallCode;
}

function initGameBoard() {
	board = new Array();
	for (let i = 0; i < boardHeight; i++) {
		board[i] = new Array();
		for (let j = 0; j < boardWidth; j++) {
			board[i][j] = 0;
		}
	}

	//create board with walls
	putWalls(board);

	//locate the pacman
	let pacmanLocation = findRandomEmptyCell(board);
	board[pacmanLocation[0]][pacmanLocation[1]] = pacCode;
	pacman.x = pacmanLocation[0];
	pacman.y = pacmanLocation[1];

	//locate the moving score
	movingScore = new Object();
	movingScore.x = 0;
	movingScore.y = 0;


	//locate black candy
	for (let i = 0; i < startingBlackCandy; i++) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = blackCandyCode;
	}

	//locate yellow candy
	for (let i = 0; i < startingYellowCandy; i++) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = yellowCandyCode;
	}

	//locate green candy
	for (let i = 0; i < startingGreenCandy; i++) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = greenCandyCode;
	}

	//locate lollipop
	let lollipopLocation = findRandomEmptyCell(board);
	board[lollipopLocation[0]][lollipopLocation[1]] = lollipopCode;

	//locate madicine
	let meidcineLocation = findRandomEmptyCell(board);
	board[meidcineLocation[0]][meidcineLocation[1]] = medicineCode;

	//locate monsters
	for (let i = 0; i < monsterNum; i++) {
		//let emptyCell = findRandomEmptyCell(board);
		// board[emptyCell[0]][emptyCell[1]] = monsterCode;
		let monster = new Object();
		if (i == 0) {//first monster
			monster.x = 0;
			monster.y = 0;
		}
		else if (i == 1) {
			monster.x = board.length;
			monster.y = 0;
		}
		else if (i == 2) {
			monster.x = 0;
			monster.y = board[0].length;
		}
		else if (i == 3) {
			monster.x = board.length;
			monster.y = board[0].length;
		}

		monstersArr[i] = monster;
	}

}

// codes on board: 2-Pacman location 1- black candy 4-Wall
function Start() {
	initGameSettings();
	initGameBoard();

	//Add Key Listeners
	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 100);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * boardHeight);
	var j = Math.floor(Math.random() * boardWidth);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * boardHeight);
		j = Math.floor(Math.random() * boardWidth);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyUp]) {
		return 'up';
	}
	if (keysDown[keyDown]) {
		return 'down';
	}
	if (keysDown[keyLeft]) {
		return 'left';
	}
	if (keysDown[keyRight]) {
		return 'right';
	}
}


function drawPacman(center) {

	if (pacmanDir == 'right') {
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if (pacmanDir == 'down') {
		context.beginPath();
		context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if (pacmanDir == 'left') {
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if (pacmanDir == 'up') {
		context.beginPath();
		context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}

}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = (gameTime - time_elapsed).toFixed(3);
	lblLives.value = lives;

	for (var i = 0; i < boardHeight; i++) {
		for (var j = 0; j < boardWidth; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == pacCode) {
				//Pacman
				drawPacman(center);

			} else if (board[i][j] == blackCandyCode) {
				//Black Candy
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			}
			else if (board[i][j] == yellowCandyCode) {
				//Yellow Candy
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "yellow"; //color
				context.fill();
			}
			else if (board[i][j] == greenCandyCode) {
				//Green Candy
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "green"; //color
				context.fill();
			}
			else if (board[i][j] == wallCode) {
				//Wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == lollipopCode) {
				//lollipop
				context.beginPath();
				let lollipopImg = new Image(60, 60);
				lollipopImg.src = 'lollipop.png';
				context.drawImage(lollipopImg, center.x - 30, center.y - 30, 60, 60);
			}
			else if (board[i][j] == medicineCode){
				//medicine
				context.beginPath();
				let medicineImg = new Image(60, 60);
				medicineImg.src = 'medicine.png';
				context.drawImage(medicineImg, center.x - 30, center.y - 30, 60, 60);

			}
		}
	}

	//put monsters
	for (let i = 0; i < monstersArr.length; i++) {
		let currMonster = monstersArr[i];
		let monsterX = currMonster.x * 60;
		let monsterY = currMonster.y * 60;
		context.beginPath();
		let monsterImg = new Image(60, 60);
		monsterImg.src = 'monster.png';
		context.drawImage(monsterImg, monsterX, monsterY, 60, 60);
	}

	//draw moving score
	if (movingScore != null) {
		let movingScoreX = movingScore.x * 60;
		let movingScoreY = movingScore.y * 60;
		context.beginPath();
		let movingScoreImg = new Image(60, 60);
		movingScoreImg.src = 'movingScore.png';
		context.drawImage(movingScoreImg, movingScoreX, movingScoreY, 60, 60);
	}

}

function UpdatePosition() {

	//move the pacman
	board[pacman.x][pacman.y] = 0;
	var keyPressed = GetKeyPressed();
	if (keyPressed == 'up') {
		//up
		if (pacman.y > 0 && board[pacman.x][pacman.y - 1] != wallCode) {
			pacman.y--;
			pacmanDir = 'up';
		}
	}
	if (keyPressed == 'down') {
		//down
		if (pacman.y < 9 && board[pacman.x][pacman.y + 1] != wallCode) {
			pacman.y++;
			pacmanDir = 'down';
		}
	}
	if (keyPressed == 'left') {
		//left
		if (pacman.x > 0 && board[pacman.x - 1][pacman.y] != wallCode) {
			pacman.x--;
			pacmanDir = 'left';
		}
	}
	if (keyPressed == 'right') {
		//right
		if (pacman.x < 9 && board[pacman.x + 1][pacman.y] != wallCode) {
			pacman.x++;
			pacmanDir = 'right';
		}
	}


	if (board[pacman.x][pacman.y] == blackCandyCode) {//black candy update
		score += 5;
	}
	else if (board[pacman.x][pacman.y] == yellowCandyCode) {//yellow candy update
		score += 15;
	}
	else if (board[pacman.x][pacman.y] == greenCandyCode) {//green candy update
		score += 25;
	}

	if (board[pacman.x][pacman.y] == medicineCode) {//medicine
		lives++;
	}
	

	//moving score
	if (movingScore != null) {
		//check moving score
		if (movingScore.x == pacman.x && movingScore.y == pacman.y) {
			score += 50;
			movingScore = null;
		}
	}

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;



	//lollipop
	if (!isLollipopEaten && board[pacman.x][pacman.y] == lollipopCode) {
		isLollipopEaten = true;
		lollipopEatenTime = time_elapsed;
		monstersSpeed = 20; //monsters speed is now slower
	}

	//if lollipop effect passed - after 5 seconds
	if (isLollipopEaten && lollipopEatenTime + 5 <= time_elapsed) {
		isLollipopEaten = false;
		monstersSpeed = 7;
	}



	//move monsters. based on their speed
	if ((loopNum % monstersSpeed) == 0) {
		UpdateMonstersPosition();
	}


	//update pacman position
	board[pacman.x][pacman.y] = pacCode;

	Draw();

	CheckGameOver();

	loopNum++;
}


function UpdateMovingScorePosition() {
	let rndNum = Math.random();

	if (rndNum <= 0.25) {//go right
		if (board.length > movingScore.x - 1 && board[movingScore.x + 1][movingScore.y] != wallCode) {
			movingScore.x += 1;
		}
	}
	else if (rndNum <= 0.5) {//go left
		if (movingScore.x > 0 && board[movingScore.x - 1][movingScore.y] != wallCode) {
			movingScore.x -= 1;
		}
	}
	else if (rndNum <= 0.75) {//go up
		if (movingScore.y > 0 && board[movingScore.x][movingScore.y - 1] != wallCode) {
			movingScore.y -= 1;
		}
	}
	else {//go down
		if (movingScore.y < board[0].length - 1 && board[movingScore.x][movingScore.y + 1] != wallCode) {
			movingScore.y += 1;
		}
	}
}

function CheckGameOver() {


	//check if time is up
	if (time_elapsed >= gameTime) {
		if (score < 100) {
			alert("You are better than " + score + " points!");
			stopGame();
		}
		else {
			alert("Winner!!")
			stopGame();
		}
	}



	//check if monsters caught pacman
	for (let i = 0; i < monstersArr.length; i++) {
		let currMonster = monstersArr[i];
		if (currMonster.x == pacman.x && currMonster.y == pacman.y) {//monster caught pacman
			lives--;
			score -= 10;
			if (lives == 0) {//game over - no lives
				stopGame();
				alert("Loser!");
			}
			initGameBoard();
		}
	}



}

//returns boolean if succeeded to move in the chosen axis
function moveMonster(monster, axis) {
	if (axis == 'y') {
		if (pacman.y > monster.y) {//go down
			if (board[monster.x][monster.y + 1] != wallCode) {//can go up
				monster.y = monster.y + 1;
				return true;
			}
		}
		else if (pacman.y < monster.y) {//go up
			if (board[monster.x][monster.y - 1] != wallCode) {
				monster.y = monster.y - 1;
				return true;
			}
		}
	}
	else if (axis == 'x') {
		if (pacman.x > monster.x) {//go right
			if (board[monster.x + 1][monster.y] != wallCode) {
				monster.x = monster.x + 1;
				return true;
			}
		}
		else if (pacman.x < monster.x) {//go left
			if (board[monster.x - 1][monster.y] != wallCode) {
				monster.x = monster.x - 1;
				return true;
			}
		}
	}

	return false;
}


function UpdateMonstersPosition() {
	for (let i = 0; i < monstersArr.length; i++) {//for every monster
		let currMonster = monstersArr[i];
		let rndNum = Math.random();

		if (rndNum <= 0.5) {//try go on y axis
			if (!moveMonster(currMonster, 'y')) {//can't move on y axis
				moveMonster(currMonster, 'x');
			}
		}
		else {
			if (!moveMonster(currMonster, 'x')) {
				moveMonster(currMonster, 'y');
			}
		}
	}

}