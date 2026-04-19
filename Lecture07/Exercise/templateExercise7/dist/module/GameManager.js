import { SYMBOLS } from "../symbols.js";
import { GameState } from "../types.js";
export function startGame(settings) {
    return {
        gameState: GameState.InProgress,
        cards: generateShuffledCards(SYMBOLS.slice(0, settings.numPairs)), // use the first x symbols of the SYMBOLS-Array
        players: settings.playerNames.map(name => ({
            name,
            score: 0
        })),
        currentPlayerIndex: 0,
        flippedCardIds: [],
        isLocked: false
    };
}
function generateShuffledCards(symbols) {
    let nextId = 0;
    const deck = symbols.flatMap((symbol) => [
        { id: nextId++, symbol, isFlipped: false, isMatched: false },
        { id: nextId++, symbol, isFlipped: false, isMatched: false }
    ]);
    return shuffle(deck);
}
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5); // e.g.: 0.3 - 0.5 = -0.2 -> negative, sometimes positive -> random order
}
export function flipCard(state, cardId) {
    if (state.isLocked) {
        return;
    }
    const card = state.cards.find(c => c.id === cardId);
    // no flipping
    if (!card || card.isFlipped || card.isMatched) {
        return;
    }
    if (state.flippedCardIds.length >= 2) {
        return;
    }
    // flip card
    card.isFlipped = true;
    state.flippedCardIds.push(card.id);
}
export function resolveMatch(state) {
    if (state.flippedCardIds.length !== 2) {
        return;
    }
    const card1 = state.cards.find(c => c.id === state.flippedCardIds[0]);
    const card2 = state.cards.find(c => c.id === state.flippedCardIds[1]);
    if (card1.symbol === card2.symbol) {
        card1.isMatched = true;
        card2.isMatched = true;
        state.players[state.currentPlayerIndex].score++;
    }
    else {
        card1.isFlipped = false;
        card2.isFlipped = false;
        // next players turn
        state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    }
    state.flippedCardIds = [];
    if (checkGameEnd(state)) {
        state.gameState = GameState.Completed;
    }
}
function checkGameEnd(state) {
    return state.cards.every(card => card.isMatched);
}
