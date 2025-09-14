class TicTacToe {
  constructor() {
    this.currentPlayer = "X";
    this.player1 = {
      name: "Player 1",
      color: "#007BFF",
      symbol: "X",
      wins: 0,
    };
    this.player2 = {
      name: "Player 2",
      color: "#FF00FF",
      symbol: "O",
      wins: 0,
    };
    this.board = Array(9).fill("");
    this.gameActive = false;
    this.startingSymbol = "X";

    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    this.winningSounds = [
      "winning/victory.mp3",
      //   "winning/victory2.mp3",
      //   "winning/victory3.mp3",
    ];

    this.drawSounds = ["draw/draw.mp3"];
    this.initializeEventListeners();
    this.initializeColors();
    this.renderPlayerWins();
  }
  renderPlayerWins() {
    const winsDiv = document.getElementById("playerWins");
    if (!winsDiv) return;
    winsDiv.innerHTML = `<span style='color:${
      this.player1.color
    };font-weight:600;'>${this.player1.name} (${this.player1.symbol}): ${
      this.player1.wins
    } win${
      this.player1.wins === 1 ? "" : "s"
    }</span> &nbsp;|&nbsp; <span style='color:${
      this.player2.color
    };font-weight:600;'>${this.player2.name} (${this.player2.symbol}): ${
      this.player2.wins
    } win${this.player2.wins === 1 ? "" : "s"}</span>`;
  }

  initializeColors() {
    // Set initial border colors for player setups
    document.getElementById("player1Setup").style.borderColor =
      this.player1.color;
    document.getElementById("player1NameInput").style.color =
      this.player1.color;
    document.getElementById("player2Setup").style.borderColor =
      this.player2.color;
    document.getElementById("player2NameInput").style.color =
      this.player2.color;
  }

  initializeEventListeners() {
    // Player 1 name input
    const player1NameInput = document.getElementById("player1NameInput");
    player1NameInput.addEventListener("input", (e) => {
      this.player1.name = e.target.value.trim() || "Player 1";
    });

    // Player 2 name input
    const player2NameInput = document.getElementById("player2NameInput");
    player2NameInput.addEventListener("input", (e) => {
      this.player2.name = e.target.value.trim() || "Player 2";
    });

    // Player 1 color buttons
    const player1Setup = document.getElementById("player1Setup");
    const player1ColorBtns = player1Setup.querySelectorAll(".color-btn");
    player1ColorBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remove active class from all buttons in this player's section
        player1ColorBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        e.target.classList.add("active");
        // Update player color
        this.player1.color = e.target.dataset.color;
        document.getElementById("player1Setup").style.borderColor =
          this.player1.color;
        document.getElementById("player1NameInput").style.color =
          this.player1.color;
      });
    });

    // Player 2 color buttons
    const player2Setup = document.getElementById("player2Setup");
    const player2ColorBtns = player2Setup.querySelectorAll(".color-btn");
    player2ColorBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remove active class from all buttons in this player's section
        player2ColorBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        e.target.classList.add("active");
        // Update player color
        this.player2.color = e.target.dataset.color;
        document.getElementById("player2Setup").style.borderColor =
          this.player2.color;
        document.getElementById("player2NameInput").style.color =
          this.player2.color;
      });
    });

    // Start game button
    document.getElementById("startGame").addEventListener("click", () => {
      this.startGame();
    });

    // New game button
    document.getElementById("newGame").addEventListener("click", () => {
      this.startingSymbol = "X";
      this.resetToSetup();
    });

    // Replay button
    document.getElementById("replayGame").addEventListener("click", () => {
      if (this.startingSymbol === "X") {
        this.startingSymbol = "O";
      } else {
        this.startingSymbol = "X";
      }
      this.resetGame();
      this.startGame();
    });

    // Cell clicks
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        this.handleCellClick(e);
      });
    });
  }

  startGame() {
    const player1Name = document
      .getElementById("player1NameInput")
      .value.trim();
    const player2Name = document
      .getElementById("player2NameInput")
      .value.trim();
    this.player1.name = player1Name || "Player 1";
    this.player2.name = player2Name || "Player 2";

    document.getElementById("setupSection").classList.add("hidden");
    document.getElementById("gameSection").classList.remove("hidden");
    document.getElementById("playerWins").classList.remove("hidden");
    this.gameActive = true;
    this.currentPlayer = this.startingSymbol;
    this.easterEgg();
    this.updateCurrentPlayerDisplay();
    this.renderPlayerWins();
  }

  resetToSetup() {
    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("playerWins").classList.add("hidden");
    document.getElementById("setupSection").classList.remove("hidden");
    this.player1.symbol = "X";
    this.player2.symbol = "O";
    this.player1.wins = 0;
    this.player2.wins = 0;
    this.resetGame();
    this.renderPlayerWins();
  }

  resetGame() {
    this.board = Array(9).fill("");
    this.gameActive = false;
    this.currentPlayer = this.startingSymbol;

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.style.color = "";
      cell.style.backgroundColor = "";
      cell.classList.remove("filled", "winning-cell");
    });

    document.getElementById("gameStatus").textContent = "";
    document.getElementById("gameStatus").className = "game-status";
    this.updateCurrentPlayerDisplay();
    this.renderPlayerWins();
  }

  handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);

    if (!this.gameActive || this.board[index] !== "") {
      return;
    }

    const currentPlayerData = this.getCurrentPlayerData();
    this.makeMove(index, currentPlayerData.symbol, currentPlayerData.color);

    if (!this.checkGameEnd()) {
      this.switchPlayer();
      this.updateCurrentPlayerDisplay();
    }
  }

  makeMove(index, symbol, color) {
    this.board[index] = symbol;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = symbol;
    cell.style.color = color;
    cell.classList.add("filled");
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  }

  checkGameEnd() {
    // Check for winner
    for (let combination of this.winningCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.gameActive = false;

        // Also need to check if winning player is egg emoji
        const winnerData =
          this.board[a] === "X" ||
          (this.board[a] === "🥚" && this.player1.symbol === "🥚")
            ? this.player1
            : this.player2;
        winnerData.wins += 1;
        this.highlightWinningCells(combination, winnerData.color);

        document.getElementById(
          "gameStatus"
        ).textContent = `${winnerData.name} Wins!`;
        document.getElementById("gameStatus").className = "game-status winner";
        document.getElementById("gameStatus").style.color = winnerData.color;
        document.getElementById("currentPlayer").textContent = "Game Over";
        this.playSound(
          this.winningSounds[
            Math.floor(Math.random() * this.winningSounds.length)
          ]
        );
        this.renderPlayerWins();
        return true;
      }
    }

    // Check for draw
    if (!this.board.includes("")) {
      this.gameActive = false;
      document.getElementById("gameStatus").textContent = "It's a Draw!";
      document.getElementById("gameStatus").className = "game-status draw";
      document.getElementById("currentPlayer").textContent = "Game Over";
      this.playSound(
        this.drawSounds[Math.floor(Math.random() * this.drawSounds.length)]
      );
      this.renderPlayerWins();
      return true;
    }

    return false;
  }

  easterEgg() {
    // If a player is named Egg, change their symbol to an egg emoji
    if (this.player1.name.toLowerCase() === "egg") {
      this.player1.symbol = "🥚";
    }
    if (this.player2.name.toLowerCase() === "egg") {
      this.player2.symbol = "🥚";
    }
  }

  // Helper function to determine if a color is light or dark
  isLightColor(color) {
    // Handle hex format
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Calculate luminance using the relative luminance formula
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return true if color is light (luminance > 0.5)
      return luminance > 0.5;
    }

    // Default to false if format is not recognized
    return false;
  }

  highlightWinningCells(combination, winnerColor) {
    const textColor = this.isLightColor(winnerColor) ? "#000000" : "#ffffff";

    combination.forEach((index) => {
      const cell = document.querySelector(`[data-index="${index}"]`);
      cell.classList.add("winning-cell");
      cell.style.backgroundColor = winnerColor;
      cell.style.color = textColor;
    });
  }

  getCurrentPlayerData() {
    return this.currentPlayer === "X" ? this.player1 : this.player2;
  }

  updateCurrentPlayerDisplay() {
    if (this.gameActive) {
      const currentPlayerData = this.getCurrentPlayerData();
      let currentPlayerElement = document.getElementById("currentPlayer");
      currentPlayerElement.textContent = `${currentPlayerData.name}'s Turn (${currentPlayerData.symbol})`;
      currentPlayerElement.style.color = currentPlayerData.color;
    }
  }

  playSound(soundfile) {
    let audio = new Audio(soundfile);
    audio.play();
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
