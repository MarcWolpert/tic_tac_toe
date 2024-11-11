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

function Board() {
    this.gameTiles = [...document.querySelectorAll(".gameTile")];
    this.gameMoves = Array(3).fill().map(() => Array(3).fill(undefined));
    this.player1 = new Player("X");
    this.player2 = new Player("O");
    this.currentPlayer = this.player1; // Start with player 1
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
    this.currentPlayer = this.player1; // Reset to player 1's turn
};

Board.prototype.handlePlayerMove = function(index) {
    if (this.gameOver) return;

    if (this.currentPlayer.makeMove(this, index)) {
        this.moveCount++;
        this.checkGameStatus();
        
        if (!this.gameOver) {
            // Switch to the other player
            this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
            document.getElementById("statusMessage").innerText = `${this.currentPlayer === this.player1 ? p1 || "Player 1" : p2 || "Player 2"}'s turn`;
        }
    }
};

Board.prototype.convert1dTo2d = function(index) {
    return [Math.floor(index / 3), index % 3];
};

Board.prototype.updateTile = function(index, symbol) {
    const tile = this.gameTiles[index];
    if (symbol === "X") {
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
        document.getElementById("statusMessage").innerText = `${winner === "X" ? p1 || "Player 1" : p2 || "Player 2"} Wins!`;
        this.gameTiles.forEach(tile => tile.disabled = true);
    } else if (this.moveCount === 9) {
        this.gameOver = true;
        document.getElementById("statusMessage").innerText = "It's a Draw!";
    }
};

Board.prototype.checkWinner = function() {
    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]], 
        [[1, 0], [1, 1], [1, 2]], 
        [[2, 0], [2, 1], [2, 2]], // Rows
        [[0, 0], [1, 0], [2, 0]], 
        [[0, 1], [1, 1], [2, 1]], 
        [[0, 2], [1, 2], [2, 2]], // Columns
        [[0, 0], [1, 1], [2, 2]], 
        [[0, 2], [1, 1], [2, 0]]  // Diagonals
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

// Handle player name inputs
const player01 = document.getElementById("player01");
const player02 = document.getElementById("player02");
const playerName01 = document.getElementById("player01Name");
const playerName02 = document.getElementById("player02Name");
let p1 = undefined;
let p2 = undefined;

player01.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        playerName01.innerText = player01.value;
        player01.value = "";
        p1 = playerName01.innerText;
    }
});

player02.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        playerName02.innerText = player02.value;
        player02.value = "";
        p2 = playerName02.innerText;
    }
});

// Initialize the game board
const gameBoard = new Board();
