function Player(symbol) {
    this.symbol = symbol;
}

Player.prototype.makeMove = function(board, index) {
    const [row, col] = board.convert1dTo2d(index);
    if (board.gameMoves[row][col] === undefined) {
        board.updateTile(index, this.symbol);
        board.gameMoves[row][col] = this.symbol;
        return true;
    }
    return false;
};

function Computer(symbol) {
    Player.call(this, symbol);
}

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

Computer.prototype.makeRandomMove = function(board) {
    let moveMade = false;
    while (!moveMade) {
        const index = Math.floor(Math.random() * 9);
        moveMade = this.makeMove(board, index);
    }
};

function Board() {
    this.gameTiles = [...document.querySelectorAll(".gameTile")];
    this.gameMoves = Array(3).fill().map(() => Array(3).fill(undefined));
    this.player = new Player("player");
    this.computer = new Computer("computer");
    this.moveCount = 0;
    this.gameOver = false;

    this.gameTiles.forEach((tile, index) => {
        tile.addEventListener("click", () => this.handlePlayerMove(index));
    });

    // Add event listener to "Play again" button
    document.querySelector(".restart").addEventListener("click", () => this.resetGame());
}

Board.prototype.resetGame = function() {
    this.gameMoves = Array(3).fill().map(() => Array(3).fill(undefined));
    this.gameTiles.forEach(tile => {
        tile.style.backgroundColor = "lightgray";
        tile.style.backgroundImage = "none";
        tile.disabled = false;
    });
    document.getElementById("statusMessage").innerText = "Make your move!";
    this.moveCount = 0;
    this.gameOver = false;
};

Board.prototype.handlePlayerMove = function(index) {
    if (this.gameOver) return;
    if (this.player.makeMove(this, index)) {
        this.moveCount++;
        this.checkGameStatus();
        if (!this.gameOver) this.computerMove();
    }
};

Board.prototype.computerMove = function() {
    this.computer.makeRandomMove(this);
    this.moveCount++;
    this.checkGameStatus();
};

Board.prototype.convert1dTo2d = function(index) {
    return [Math.floor(index / 3), index % 3];
};

Board.prototype.updateTile = function(index, player) {
    const tile = this.gameTiles[index];
    if (player === "player") {
        tile.style.backgroundColor = "black";
        tile.style.backgroundImage = "url('icons/circle_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg')";
    } else {
        tile.style.backgroundColor = "red";
        tile.style.backgroundImage = "url('icons/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg')";
    }
    tile.style.backgroundSize = "contain";
    tile.style.backgroundRepeat = "no-repeat";
    tile.style.backgroundPosition = "center center";
};

Board.prototype.checkGameStatus = function() {
    const winner = this.checkWinner();
    if (winner) {
        this.gameOver = true;
        document.getElementById("statusMessage").innerText = winner === "player" ? "Player Wins!" : "Computer Wins!";
        this.gameTiles.forEach(tile => tile.disabled = true);
    } else if (this.moveCount === 9) {
        this.gameOver = true;
        document.getElementById("statusMessage").innerText = "It's a Draw!";
    }
};

Board.prototype.checkWinner = function() {
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], // Rows
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], // Columns
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]  // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (this.gameMoves[a[0]][a[1]] && this.gameMoves[a[0]][a[1]] 
            === this.gameMoves[b[0]][b[1]] && this.gameMoves[a[0]][a[1]] 
            === this.gameMoves[c[0]][c[1]]) {
            return this.gameMoves[a[0]][a[1]];
        }
    }
    return null;
};

// Initialize the game board
const gameBoard = new Board();
