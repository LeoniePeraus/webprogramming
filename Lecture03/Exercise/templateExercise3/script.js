let cards = ['🍎', '🍐', '🍑', '🍒',
            '🍎', '🍐', '🍑', '🍒']; // more: '🍓', '🍇', '🍉', '🍌', '🍍', '🥝', '🥥', '🍏', '🍋', '🍊'

let gameBoard = document.getElementById('game-board');
let flippedCards = [];
let numOfMatchedPairs = 0;

shuffle(cards);
displayCards();
displayResetButton();


function shuffle(arr) {
    arr.sort(() => Math.random() - 0.5); // e.g.: 0.3 - 0.5 = -0.2 -> negative, sometimes positive -> random order
}

function displayCards() {
    for(let symbol of cards) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol; // e.g. HTML: <div class="card" data-symbol="🍎"></div> -> symbol could be any name
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard(event) {
    if (flippedCards.length < 2) {
        let card = event.target; // get the element where the event occurred
        if (card.classList.contains('flipped')) {
            return;
        }
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        flippedCards.push(card);
    }
    
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    let card1 = flippedCards[0];
    let card2 = flippedCards[1];
    // advanced way: let [card1, card2] = flippedCards; "Array Destructuring"
    if (card1.dataset.symbol === card2.dataset.symbol) {
        numOfMatchedPairs++;
        flippedCards = [];
        if (numOfMatchedPairs === cards.length / 2) {
            displaySuccessMassage();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 1000); // 1s
    }
}

function displaySuccessMassage() {
    let message = document.createElement('p');
    message.textContent = "Congratulation!";
    gameBoard.appendChild(message);
}

function displayResetButton() {
    let resetButton = document.createElement('button');
    resetButton.textContent = "Reset";
    resetButton.classList.add('btn', 'btn-secondary');
    resetButton.addEventListener('click', reset);
    gameBoard.appendChild(resetButton);
}

function reset() {
    gameBoard.innerHTML = '';
    shuffle(cards);
    displayCards();
    displayResetButton();
    flippedCards = [];
    numOfMatchedPairs = 0;
}