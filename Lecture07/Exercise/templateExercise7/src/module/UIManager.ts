import { GameSettings, GameState, GameStateData } from "../types.js";


export function render(state: GameStateData): void {
    renderBord(state);
    renderScoreboard(state);
    renderEndScreen(state);
    renderGameState(state);
}

function renderBord(state: GameStateData): void {
    const board = document.getElementById("game-board")!;
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

function renderScoreboard(state: GameStateData): void {
    const scoreboard = document.getElementById("score-board")!;
    scoreboard.innerHTML = "";

    state.players.forEach((player, index) => {
        const el = document.createElement("div");

        el.textContent = `${player.name}: ${player.score}`;

        if (index === state.currentPlayerIndex) {
            el.classList.add("active-player");
        }

        scoreboard.appendChild(el);
    })
}

function renderEndScreen(state: GameStateData): void {
    const endScreen = document.getElementById("endScreen")!;

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

function renderGameState(state: GameStateData): void {
    const el = document.getElementById("gameState")!;
    el.textContent = state.gameState;
}

export function onCardClick(handler: (cardId: number) => void): void { // get a function "handler" as a parameter
    const board = document.getElementById("game-board")!;

    board.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const cardEl = target.closest(".card") as HTMLElement;
        if (!cardEl) { return; }

        const id = Number(cardEl.dataset.id);
        handler(id); // now the function "handler" says what should be done when the card gets clicked and gets the cardId provided
    });
}

export function onStart(handler: (settings: GameSettings) => void): void { // get a function "handler" as a parameter
    document.getElementById("startBtn")!.addEventListener("click", () => {
        const player1: string = (document.getElementById("player1") as HTMLInputElement).value || "Player 1";
        const player2: string = (document.getElementById("player2") as HTMLInputElement).value || "Player 2";
        
        const numPairsInput: number = Number((document.getElementById("numPairs") as HTMLInputElement).value);
        const newNumPairsValue: number = Math.min(Math.max(numPairsInput, 1), 14); // input between 1 and 14 allowed
        const numPairsEl = document.getElementById("numPairs") as HTMLInputElement;
        numPairsEl.value = newNumPairsValue.toString(); // update value

        handler({ // now the function "handler" says what should be done when the startBtn gets clicked and get the settings provided
            numPairs: newNumPairsValue,
            isMultiplayer: true,
            playerNames: [player1, player2]
        });
    });
}

export function onReset(handler: () => void): void { // get a function "handler" as a parameter
    document.getElementById("resetBtn")!.addEventListener("click", handler); // now the function "handler" says what should be done when the resetBtn gets clicked
}