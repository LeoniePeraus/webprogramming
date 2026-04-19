export interface Card {
    id: number;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface Player {
    name: string;
    score: number;
}

export interface GameSettings {
    numPairs: number;
    isMultiplayer: boolean;
    playerNames: string[];
}

export enum GameState {
    NotStarted = "Not Started",
    InProgress = "In Progress",
    Completed = "Completed"
}

export interface GameStateData {
    gameState: GameState;
    cards: Card[];
    players: Player[];
    currentPlayerIndex: number;
    flippedCardIds: number[];
    isLocked: boolean;
}