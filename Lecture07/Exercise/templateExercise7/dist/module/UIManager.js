import { GameState } from "../types.js";
export function render(state) {
    renderBord(state);
    renderScoreboard(state);
    renderEndScreen(state);
    renderGameState(state);
}
function renderBord(state) {
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    state.cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        if (card.isFlipped || card.isMatched) {
            cardEl.textContent = card.symbol;
            cardEl.classList.add("flipped");
        }
        if (card.isMatched) {
            cardEl.classList.add("matched");
        }
        cardEl.dataset.id = card.id.toString(); // gives the card its id
        board.appendChild(cardEl);
    });
}
function renderScoreboard(state) {
    const scoreboard = document.getElementById("score-board");
    scoreboard.innerHTML = "";
    state.players.forEach((player, index) => {
        const el = document.createElement("div");
        el.textContent = `${player.name}: ${player.score}`;
        if (index === state.currentPlayerIndex) {
            el.classList.add("active-player");
        }
        scoreboard.appendChild(el);
    });
}
function renderEndScreen(state) {
    const endScreen = document.getElementById("endScreen");
    if (state.gameState !== GameState.Completed) {
        endScreen.style.display = "none";
        return;
    }
    endScreen.style.display = "block";
    const winner = [...state.players].sort((a, b) => b.score - a.score)[0]; // ...shallow copy of players, because
    // they get modified with sort; descending because b-a; sort(a,b) result is - -> a is sorted before b, + -> b is sorted before a
    endScreen.innerHTML = `
        <h2>Game Over</h2>
        <p>Winner: ${winner.name}</p>
    `;
}
function renderGameState(state) {
    const el = document.getElementById("gameState");
    el.textContent = state.gameState;
}
export function onCardClick(handler) {
    const board = document.getElementById("game-board");
    board.addEventListener("click", (e) => {
        const target = e.target;
        const cardEl = target.closest(".card");
        if (!cardEl) {
            return;
        }
        const id = Number(cardEl.dataset.id);
        handler(id); // now the function "handler" says what should be done when the card gets clicked and gets the cardId provided
    });
}
export function onStart(handler) {
    document.getElementById("startBtn").addEventListener("click", () => {
        const player1 = document.getElementById("player1").value || "Player 1";
        const player2 = document.getElementById("player2").value || "Player 2";
        const numPairsInput = Number(document.getElementById("numPairs").value);
        const newNumPairsValue = Math.min(Math.max(numPairsInput, 1), 14); // input between 1 and 14 allowed
        const numPairsEl = document.getElementById("numPairs");
        numPairsEl.value = newNumPairsValue.toString(); // update value
        handler({
            numPairs: newNumPairsValue,
            isMultiplayer: true,
            playerNames: [player1, player2]
        });
    });
}
export function onReset(handler) {
    document.getElementById("resetBtn").addEventListener("click", handler); // now the function "handler" says what should be done when the resetBtn gets clicked
}
