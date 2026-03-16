// --- 1. Variables ---
const cards = document.querySelectorAll(".card");
const levelBox = document.getElementById("level");
const scoreBox = document.getElementById("score");

let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let score = 0;
let started = false;
let isPlaying = false;
let gameSpeed = 600;
let pregame = document.getElementById("pregame");
let gameUber = document.getElementById("gameUber");

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (!started) return; // Prevent clicks if game hasn't started
        if(isPlaying) return;

        userClickedPattern.push(index);
        animateCard(card);
        
        checkAnswer(userClickedPattern.length - 1);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode == 32) {
        pregame.style.display = "none";
        setTimeout(()=>{
            startGame();
        },1000)
    }
});

function startGame() {
    started = true;
    level = 0;
    score = 0;
    gamePattern = [];
    nextRound();
}

function nextRound() {
    userClickedPattern = []; 
    level++;
    if(gameSpeed < 150){
        gameSpeed=150;
    }else{
        gameSpeed-=20;
    }
    levelBox.innerHTML = level;
    scoreBox.innerHTML = score;

    let randomNum = Math.floor(Math.random() * cards.length);
    gamePattern.push(randomNum);

    playSequence();
}

function playSequence() {
    isPlaying =true
    gamePattern.forEach((cardIndex, i) => {
        setTimeout(() => {
            animateCard(cards[cardIndex]);
            if(i === gamePattern.length - 1)
            {
                setTimeout(()=>{
                    isPlaying=false
                },300)
            }
        }, i * gameSpeed); 
    });

}

function checkAnswer(currentStep) {
    if (userClickedPattern[currentStep] === gamePattern[currentStep]) {
        
        if (userClickedPattern.length === gamePattern.length) {
            score += 6;
            timer = 31;
            setTimeout(() => {
                nextRound();
            }, 1000);
        }
    } else {
        // Wrong move
        gameOver();
    }
}

function animateCard(card) {
    card.classList.add('active');
    
    setTimeout(() => {
        card.classList.remove('active');
    }, 250);
}

function gameOver() {
    // 1. Immediate visual feedback (Shake & Red Flash)
    document.body.classList.add('shake', 'game-over-bg');
    
    // 2. Display the Game Over message
    gameUber.innerHTML = `Game Over! Your score: ${score}`;
    gameUber.style.display = "block";
    gameUber.style.cssText = "position: absolute; inset: 0; z-index: 9999;";

    setTimeout(() => {
        document.body.classList.remove('shake', 'game-over-bg');
        gameUber.style.display = "none";
        pregame.style.display = "block";
        pregame.style.cssText = "position: absolute; inset: 0; z-index: 9999;";

        started = false;
        gameSpeed = 600; 
    }, 2000); 
}

