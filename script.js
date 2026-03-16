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


cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (!started) return; // Prevent clicks if game hasn't started
        if(isPlaying) return;

        userClickedPattern.push(index);
        animateCard(card);
        
        checkAnswer(userClickedPattern.length - 1);
    });
});

document.addEventListener('keydown', () => {
    if (!started) {
        startGame();
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
            score += 5;
            
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
    }, 300);
}

function gameOver() {
    document.body.classList.add('shake', 'game-over-bg');
    levelBox.innerHTML = "Game Over! Press any key to Restart";
    started = false;
    setTimeout(() => {
        document.body.classList.remove('shake', 'game-over-bg');
    }, 500);
    // You could add a 'game-over' class to the body for a red flash here
}