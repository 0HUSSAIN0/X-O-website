// تحديد العناصر الأساسية
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const aiMode = document.getElementById('ai-mode');
const friendMode = document.getElementById('friend-mode');
const moveSound = document.getElementById('move-sound');
const winSound = document.getElementById('win-sound');

// المتغيرات الأساسية
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = '';

// اختيار وضع اللعب
aiMode.addEventListener('click', () => initializeGame('ai'));
friendMode.addEventListener('click', () => initializeGame('friend'));

// بدء اللعبة وإعادة ضبط اللوحة
function initializeGame(mode) {
    gameMode = mode;
    resetBoard();
    cells.forEach(cell => cell.addEventListener('click', handleClick));
}

// إعادة ضبط اللوحة
function resetBoard() {
    board.fill('');
    currentPlayer = 'X';
    result.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

// عند الضغط على خلية
function handleClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (board[index] !== '') return;

    makeMove(index);

    if (checkWinner()) {
        winSound.play();
        result.textContent = `${currentPlayer} فاز!`;
        endGame();
        return;
    }

    if (board.every(cell => cell !== '')) {
        result.textContent = 'تعادل!';
        endGame();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // تأخير حركة الذكاء الاصطناعي
    }
}

// تنفيذ حركة اللاعب أو الذكاء الاصطناعي
function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add('taken');
    moveSound.play();
}

// الذكاء الاصطناعي باستخدام Minimax
function aiMove() {
    const bestMove = getBestMove();
    makeMove(bestMove);

    if (checkWinner()) {
        winSound.play();
        result.textContent = `${currentPlayer} فاز!`;
        endGame();
        return;
    }

    currentPlayer = 'X';
}

// تحديد أفضل حركة باستخدام Minimax
function getBestMove() {
    let bestScore = -Infinity;
    let move = 0;

    board.forEach((cell, index) => {
        if (cell === '') {
            board[index] = 'O';
            const score = minimax(board, 0, false);
            board[index] = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    return move;
}

// خوارزمية Minimax
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();

    if (winner) return winner === 'O' ? 10 - depth : depth - 10;

    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;

        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[index] = '';
            }
        });

        return bestScore;
    } else {
        let bestScore = Infinity;

        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[index] = '';
            }
        });

        return bestScore;
    }
}

// التحقق من الفائز
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // الصفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // الأعمدة
        [0, 4, 8], [2, 4, 6]             // الأقطار
    ];

    for (const condition of winConditions) {
        const [a, b, c] = condition;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

// إنهاء اللعبة
function endGame() {
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}
