This memory game consists of:
... types.ts where all interfaces and enums are specified in
... GameManager.ts where the logic happens (exported functions: startGame, flipCard, resolveMatch -> all other functions just help)
... UIManager.ts with the UI and DOM interaction (exported functions: render, onCardClick, onStart, onReset -> all other functions just help)
... main.ts where everything is combined and the entry point of this application

For the game, the user can select the number of pairs (1-14) and add 2 names, otherwise Player 1 and Player 2 gets used.
Then, the user presses the start-button and the cards are displayed as well as the players with their scores.
Its the red players turn and when matching two cards that do not contain the same symbol, its the other players turn.
At the end, the winner is displayed and the game can be resetted or new settings can be chosen.

Have fun!