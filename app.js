// Element Selectors
let boxes = document.querySelectorAll(".box");
let reset = document.querySelector(".reset");
let Winner = document.querySelector(".msg");
let modeSelect = document.getElementById("mode");

// Name Inputs
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const player1InputDiv = document.getElementById("player1-input");
const player2InputDiv = document.getElementById("player2-input");

// Game State
let xTurn = true;
let moveCount = 0;
let mode = "pvp"; // Default Mode
let player1Name = "Player 1";
let player2Name = "Player 2";

// Winning Patterns
const pattern = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Mode Change Event
modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;

  // Show/hide input fields
  if (mode === "pvp") {
    player1InputDiv.style.display = "flex";
    player2InputDiv.style.display = "flex";
  } else {
    player1InputDiv.style.display = "flex";
    player2InputDiv.style.display = "none";
    player2Input.value = ""; // Clear if switching from PvP
  }

  resetGame();
});

// Reset Game
const resetGame = () => {
  xTurn = true;
  moveCount = 0;
  Winner.parentElement.classList.remove("show");

  // Update names
  if (mode === "pvp") {
    player1Name = player1Input.value || "Player 1";
    player2Name = player2Input.value || "Player 2";
  } else {
    player1Name = player1Input.value || "You";
    player2Name = "Computer";
  }

  boxes.forEach((box) => {
    box.innerHTML = "";
    box.style.pointerEvents = "auto";
  });
};

// Stop All Interaction
const stopGame = () => {
  boxes.forEach((box) => box.style.pointerEvents = "none");
};

// Handle Draw
const gameDraw = () => {
  Winner.innerText = `⚖️ It's a draw! Well played.`;
  Winner.parentElement.classList.add("show");
  stopGame();
};

// Show Winner
const showWinner = (winner) => {
  Winner.innerText = `🎉 Congratulations! ${symbolToPlayer(winner)} wins`;
  Winner.parentElement.classList.add("show");
  stopGame();
};

// Check Winning Condition
const checkWinner = () => {
  for (let p of pattern) {
    let a = boxes[p[0]].innerText;
    let b = boxes[p[1]].innerText;
    let c = boxes[p[2]].innerText;
    if (a !== "" && a === b && b === c) {
      return a;
    }
  }
  return null;
};

// Simple Bot Move (random)
const botMove = () => {
  let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
  if (emptyBoxes.length === 0) return;

  let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  randomBox.innerHTML = "X"; // Bot plays 'X'
  randomBox.style.pointerEvents = "none";
  moveCount++;

  let winner = checkWinner();
  if (winner) {
    showWinner(winner);
  } else if (moveCount === 9) {
    gameDraw();
  }
};

// Symbol to Name Mapping
const symbolToPlayer = (symbol) => {
  const name1 = player1Input.value || "Player 1";
  const name2 = mode === "pvp" ? (player2Input.value || "Player 2") : "Computer";

  if (symbol === "O") return name1;
  if (symbol === "X") return name2;
  return symbol;
};

// Box Click Handler
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerHTML !== "") return;

    if (mode === "pvp") {
      box.innerHTML = xTurn ? "O" : "X";
      xTurn = !xTurn;
      moveCount++;
      let winner = checkWinner();
      if (winner) {
        showWinner(winner);
      } else if (moveCount === 9) {
        gameDraw();
      }
    } else if (mode === "bot") {
      box.innerHTML = "O"; // You are 'O'
      box.style.pointerEvents = "none";
      moveCount++;

      let winner = checkWinner();
      if (winner) {
        showWinner(winner);
      } else if (moveCount === 9) {
        gameDraw();
      } else {
        setTimeout(() => {
          botMove(); // Bot plays after short delay
        }, 500);
      }
    }
  });
});

// Reset Button Handler
reset.addEventListener("click", resetGame);

// Initial Setup
resetGame();
