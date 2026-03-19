// my code
interface PianoKey {
    note: string;
    key: string;
}

const keys: PianoKey[] = [
    {note: "C", key: "a"},
    {note: "D", key: "s"},
    {note: "E", key: "d"},
    {note: "F", key: "f"},
    {note: "G", key: "g"},
    {note: "A", key: "h"},
    {note: "B", key: "j"}
];
const numOfThemeButtons: number = 3;
let displayedTheme: number = 0;

function playSound(note: string): void {
    console.log("Playing: ", note);
    let audio = new Audio(`sounds/${note}.mp3`);
    audio.play();
}

for (let i in keys) {
    const noteButton = document.getElementById(keys[i].note) as HTMLButtonElement;
    noteButton.addEventListener("mousedown", function() {
        playSound(keys[i].note);
    });
}

document.addEventListener("keydown", function(event: KeyboardEvent) {
    for (let i in keys) {
        if(event.key === `${keys[i].key}`) {
            // visual feedback for keyboard input
            const noteButton = document.getElementById(keys[i].note) as HTMLButtonElement;
            noteButton.classList.add('pressed');
            setTimeout(function () {noteButton.classList.remove('pressed'); }, 100);
            
            playSound(keys[i].note);
        }
    }
});

async function loadNotes(id: number) {
    try{
        const response = await fetch("notes.json");
        const data = await response.json();
        return data[id-1].notes; // id-1 = array position
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

for(let i = 1; i <= numOfThemeButtons; i++) {
    const themeButton = document.getElementById(`theme${i}`) as HTMLButtonElement;
    themeButton.addEventListener("click", function() {
        loadNotes(i).then(n => {
            const noteLine = document.getElementById("noteLine") as HTMLDivElement;
            noteLine.innerText = `Theme ${i}: ${n}`;
            displayedTheme = i;
        });
    });
}

const playButton = document.getElementById("play") as HTMLButtonElement;
playButton.addEventListener("click", function() {
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

const resetButton = document.getElementById("reset") as HTMLButtonElement;
resetButton.addEventListener("click", function() {
    if (displayedTheme) {
        displayedTheme = 0;
        const noteLine = document.getElementById("noteLine") as HTMLDivElement;
        noteLine.innerText = "";
    }
});