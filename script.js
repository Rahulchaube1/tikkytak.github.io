const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeSwitchButton = document.getElementById('toggle-mode');
const playWithFriendsButton = document.getElementById('play-with-friends');
const playWithComputerButton = document.getElementById('play-with-computer');
const congratulationDisplay = document.getElementById('congratulation');
const winImage = document.getElementById('win-image');
const winText = document.getElementById('win-text');
const drawMessage = document.getElementById('draw-message');
const drawImage = document.getElementById('draw-image');

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playingWithComputer = false;
let xScore = 0;
let oScore = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleSquareClick(event) {
    const clickedSquare = event.target;
    const clickedSquareIndex = parseInt(clickedSquare.getAttribute('data-index'));

    if (boardState[clickedSquareIndex] !== '' || !gameActive) {
        return;
    }

    boardState[clickedSquareIndex] = currentPlayer;
    clickedSquare.textContent = currentPlayer;
    checkForWinner();

    if (playingWithComputer && gameActive) {
        currentPlayer = 'O'; // Switch to the computer's turn
        computerPlay();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch to the next player
    }
}

function computerPlay() {
    let emptySquares = boardState.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    boardState[randomSquare] = currentPlayer;
    document.querySelector(`.square[data-index='${randomSquare}']`).textContent = currentPlayer;
    checkForWinner();
    currentPlayer = 'X'; // Switch back to the first player
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            showWinner(boardState[a]);
            break;
        }
    }

    if (!roundWon && !boardState.includes('')) {
        showDrawMessage();
    } else if (!roundWon) {
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    }
}

function showWinner(winner) {
    gameActive = false;
    statusDisplay.textContent = `Player ${winner} has won!`;
    winImage.src = 'https://media.tenor.com/HkRnaabRp3sAAAAi/celebrate-celebration.gif';
    winText.textContent = `Congratulations Player ${winner}!`;
    congratulationDisplay.style.display = 'flex';

    if (winner === 'X') {
        xScore++;
        document.getElementById('x-score').textContent = xScore;
    } else {
        oScore++;
        document.getElementById('o-score').textContent = oScore;
    }
}

function showDrawMessage() {
    gameActive = false;
    statusDisplay.textContent = 'Game ended in a draw!';
    drawMessage.style.display = 'flex';
}

function handleReset() {
    gameActive = true;
    currentPlayer = 'X';
    boardState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    document.querySelectorAll('.square').forEach(square => square.textContent = '');
    congratulationDisplay.style.display = 'none';
    drawMessage.style.display = 'none';
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    modeSwitchButton.textContent = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

function setGameMode(isComputer) {
    playingWithComputer = isComputer;
    handleReset(); // Reset the game when switching modes
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
}

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-index', i);
        square.addEventListener('click', handleSquareClick);
        board.appendChild(square);
    }

    resetButton.addEventListener('click', handleReset);
    modeSwitchButton.addEventListener('click', toggleMode);
    playWithFriendsButton.addEventListener('click', () => setGameMode(false));
    playWithComputerButton.addEventListener('click', () => setGameMode(true));
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
});