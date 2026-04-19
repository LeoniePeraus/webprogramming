import { GameState } from "./types.js";
import { startGame, flipCard, resolveMatch } from "./module/GameManager.js";
import { render, onCardClick, onStart, onReset } from "./module/UIManager.js";
let state;
let currentSettings;
onStart((settings) => {
    currentSettings = settings;
    state = startGame(settings);
    render(state);
});
onReset(() => {
    if (!currentSettings || state.isLocked) {
        return;
    }
    state = startGame(currentSettings);
    render(state);
});
onCardClick((cardId) => {
    if (state.gameState !== GameState.InProgress) {
        alert("The game is not active!");
        return;
    }
    if (state.isLocked) {
        return;
    }
    flipCard(state, cardId);
    render(state);
    if (state.flippedCardIds.length === 2) {
        state.isLocked = true;
        setTimeout(() => {
            resolveMatch(state);
            state.isLocked = false;
            render(state);
        }, 1000); // 1s
    }
});
