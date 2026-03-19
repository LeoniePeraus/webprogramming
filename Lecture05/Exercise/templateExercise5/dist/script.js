"use strict";
const keys = [
    { note: "C", key: "a" },
    { note: "D", key: "s" },
    { note: "E", key: "d" },
    { note: "F", key: "f" },
    { note: "G", key: "g" },
    { note: "A", key: "h" },
    { note: "B", key: "j" }
];
const numOfThemeButtons = 3;
let displayedTheme = 0;
function playSound(note) {
    console.log("Playing: ", note);
    let audio = new Audio(`sounds/${note}.mp3`);
    audio.play();
}
for (let i in keys) {
    const noteButton = document.getElementById(keys[i].note);
    noteButton.addEventListener("mousedown", function () {
        playSound(keys[i].note);
    });
}
document.addEventListener("keydown", function (event) {
    for (let i in keys) {
        if (event.key === `${keys[i].key}`) {
            // visual feedback for keyboard input
            const noteButton = document.getElementById(keys[i].note);
            noteButton.classList.add('pressed');
            setTimeout(function () { noteButton.classList.remove('pressed'); }, 100);
            playSound(keys[i].note);
        }
    }
});
async function loadNotes(id) {
    try {
        const response = await fetch("notes.json");
        const data = await response.json();
        return data[id - 1].notes; // id-1 = array position
    }
    catch (error) {
        console.error("Error loading notes:", error);
    }
}
for (let i = 1; i <= numOfThemeButtons; i++) {
    const themeButton = document.getElementById(`theme${i}`);
    themeButton.addEventListener("click", function () {
        loadNotes(i).then(n => {
            const noteLine = document.getElementById("noteLine");
            noteLine.innerText = `Theme ${i}: ${n}`;
            displayedTheme = i;
        });
    });
}
const playButton = document.getElementById("play");
playButton.addEventListener("click", function () {
    if (displayedTheme) {
        loadNotes(displayedTheme).then(n => {
            for (let i = 0; i < n.length; i++) {
                setTimeout(() => {
                    playSound(n[i]);
                }, i * 800);
            }
        });
    }
});
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", function () {
    if (displayedTheme) {
        displayedTheme = 0;
        const noteLine = document.getElementById("noteLine");
        noteLine.innerText = "";
    }
});
