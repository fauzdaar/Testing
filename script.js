import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtVBiJzBTjP4nbuHTyez1LHmB9vc9xyXg",
    authDomain: "tic-tac-toe-maira.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-maira-default-rtdb.firebaseio.com/",
    projectId: "tic-tac-toe-maira",
    storageBucket: "tic-tac-toe-maira.appspot.com",
    messagingSenderId: "826386555883",
    appId: "1:826386555883:web:b28a4257eb2f4e3d676fae",
    measurementId: "G-CS39XGSG3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentPlayer = "X";
let playerSymbol = "";
let playerAssigned = false;

// Assign player symbol (X or O)
onValue(ref(db, "players"), (snapshot) => {
    const players = snapshot.val() || {};
    if (!playerAssigned) {
        if (!players.X) {
            set(ref(db, "players/X"), true);
            playerSymbol = "X";
        } else if (!players.O) {
            set(ref(db, "players/O"), true);
            playerSymbol = "O";
        }
        playerAssigned = true;
        document.getElementById("status").innerText = `You are Player ${playerSymbol}`;
    }
});

// Function to update Firebase when a move is made
function updateMove(position) {
    set(ref(db, "game/" + position), playerSymbol);
    set(ref(db, "turn"), playerSymbol === "X" ? "O" : "X"); // Update turn
}

// Function to listen for game changes
onValue(ref(db, "game"), (snapshot) => {
    const gameData = snapshot.val();
    if (gameData) {
        for (let pos in gameData) {
            document.getElementById(pos).innerText = gameData[pos];
        }
        checkWin();
    }
});

// Track whose turn it is
onValue(ref(db, "turn"), (snapshot) => {
    const turn = snapshot.val();
    if (turn) {
        currentPlayer = turn;
        document.getElementById("turnIndicator").innerText = `It's Player ${turn}'s turn`;
    }
});

// Add event listeners to cells
document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", function () {
        if (!this.innerText && currentPlayer === playerSymbol) {
            updateMove(this.id);
        }
    });
});

// Function to check for a win
function checkWin() {
    const cells = document.querySelectorAll(".cell");
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (cells[a].innerText && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText) {
            document.getElementById("status").innerText = `Player ${cells[a].innerText} Wins!`;
            remove(ref(db, "turn")); // Stop game after win
            return;
        }
    }
}

// Reset button functionality
document.getElementById("reset").addEventListener("click", () => {
    remove(ref(db, "game"));
    remove(ref(db, "turn"));
    document.querySelectorAll(".cell").forEach((cell) => (cell.innerText = ""));
    document.getElementById("status").innerText = "Game Reset!";
    document.getElementById("turnIndicator").innerText = "";
});
