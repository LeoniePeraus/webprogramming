let allKeys = [
    {id: "keyC", note: "C", keyBd: "a"},
    {id: "keyD", note: "D", keyBd: "s"},
    {id: "keyE", note: "E", keyBd: "d"},
    {id: "keyF", note: "F", keyBd: "f"},
    {id: "keyG", note: "G", keyBd: "g"},
    {id: "keyA", note: "A", keyBd: "h"},
    {id: "keyB", note: "B", keyBd: "j"}
];

function playSound(note) {
    console.log("Playing: ", note);
    let audio = new Audio(`sounds/${note}.mp3`);
    audio.play();
}

for (let i in allKeys) {
    document.getElementById(allKeys[i].id).addEventListener("mousedown", function() {
        playSound(allKeys[i].note);
    });
}

document.addEventListener("keydown", function(event) {
    for (let i in allKeys) {
        if(event.key === `${allKeys[i].keyBd}`) {
            // extra feature: visual feedback for keyboard input
            document.getElementById(allKeys[i].id).classList.add('pressed');
            setTimeout(function () {document.getElementById(allKeys[i].id).classList.remove('pressed'); }, 100);
            
            playSound(allKeys[i].note);
        }
    }
});