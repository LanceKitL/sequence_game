// scoreBoard
const levelSpan = document.getElementById("level")
const scoreSpan = document.getElementById("score")
const cards = document.querySelectorAll(".card");

// states
let gameState = 'idle'
let level = 0
let score = 0
let sequence = [];
let playerIndex = 0;
const audCtx = new AudioContext();

const BTN_FREQ = [200,250,300,350,450,500,550,600,650];
function playSound(freq, isCorrect){
    const osc = audCtx.createOscillator();
    const gain = audCtx.createGain();
    osc.connect(gain);
    gain.connect(audCtx.destination);
    osc.frequency.value = isCorrect ? freq : 100;
    gain.gain.setValueAtTime(0.3, audCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audCtx.currentTime + 0.3);
}

// helper function
const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadGame(){
    const gameScreen = document.createElement('div');
    const div = document.createElement('div');
    const btn = document.createElement('button');
    const txt = document.createElement('h1');
    btn.textContent="start";
    txt.textContent="Press Start to Play"
    
    div.style.cssText=
    `
        display: grid;
        place-items:center;
    `

    gameScreen.style.cssText=
    `
        position: absolute;
        inset: 0;
        display: grid;
        background-color: rgba(26, 21, 21, 0.42);
        backdrop-filter: blur(3px);
        place-items: center;
    `

    btn.style.cssText=
    `
        padding: .5rem 2rem;
        font-size: 2rem;
        background-color: rgba(2, 2, 32, 0.5);
        color:white;
        border: transparent;
        border-radius: .5rem;
    `
    div.append(txt, btn);
    gameScreen.append(div);
    document.body.append(gameScreen);

    btn.addEventListener("click", () => {
        gameScreen.style.display="none";
        startGame();
    })
}

document.addEventListener("DOMContentLoaded", ()=>{
    loadGame();
})

// listen to click for every card
cards.forEach((card,i) => {
    card.addEventListener('click', ()=>{
        handleClick(i);
    })
});

async function startGame(){
    await sleep(300);
    sequence = [];
    level = 1;
    score = 0;
    sequence.push(Math.floor(Math.random()*9))
    updateDisplay();
    playSequence();
}

async function playSequence(){
    console.log('playing seq');
    gameState="playing"
    await sleep(600);

    for(let i = 0; i < sequence.length; i++){
        const btnIndex = sequence[i];
        lightUp(btnIndex);
        playSound(BTN_FREQ[btnIndex], true)
        await sleep(500);
        lightOff(btnIndex);
        await sleep(300);
    }

    console.log("users turn");
    gameState = 'input'
    playerIndex =0

}

function updateDisplay(){
    levelSpan.textContent=level;
    scoreSpan.textContent=score;
}

function lightUp(index){
    cards[index].classList.add('play')
}

function lightOff(index){
    cards[index].classList.remove('play');
}

async function handleClick(index){
    if(gameState !== 'input') return;
    const isCorrect = index === sequence[playerIndex];

    playSound(BTN_FREQ[index], isCorrect);
    if(!isCorrect){document.body.classList.add('shake');}

    gameState='animating'
    // animate click
    lightUp(index);
    await sleep(200);
    lightOff(index);
    // isCorrect

    if(!isCorrect){
        gameState='idle'
        gameOver()
        return;
    }

    gameState='input'
    playerIndex++

    if(playerIndex === sequence.length){
        sequence.push(Math.floor(Math.random()*9))
        level++;
        score+=6;
        updateDisplay();
        playSequence();
    }
}

async function gameOver(){
    const gameOverScreen = document.createElement('div');
    const gameOverText = document.createElement('p');

    gameOverText.textContent = "Game Over!"

    gameOverScreen.style.cssText = 
    `
        display:grid;
        place-items:center;
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.47);
        
    `

    gameOverText.style.cssText = 
    `
        color:white;
        font-size: 5rem;
    `

    gameOverScreen.append(gameOverText);
    document.body.append(gameOverScreen);

    await sleep(1000);
    gameOverScreen.style.display="none";

    loadGame();
}
