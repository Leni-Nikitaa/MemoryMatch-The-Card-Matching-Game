const cards = document.querySelectorAll(".card");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const refreshBtn = document.querySelector(".details button");
const difficultySelect = document.getElementById("difficulty-select");
const flipSound = new Audio("flip.wav"); // Replace with the actual path to your flip sound file
const matchSound = new Audio("match.wav"); // Replace with the actual path to your match sound file
const wrongSound = new Audio("wrong.wav");
let maxTime = 0;
let maxFlips = 0;
let timeLeft = maxTime;
let flips = 0;
let matchedCards = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
function setDifficulty() {
    const selectedDifficulty = difficultySelect.value;

    switch (selectedDifficulty) {
        case "easy":
            maxTime = 60;
            maxFlips = 12;
            break;
        case "medium":
            maxTime = 45;
            maxFlips = 10;
            break;
        case "hard":
            maxTime = 30;
            maxFlips = 8;
            break;
        default:
            maxTime = 60;
            maxFlips = 12;
            break;
    }
}
function initGame() {
    setDifficulty();
    timeLeft = maxTime;
    flips = 0;
    matchedCards = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;
    shuffleCards();
}
function initTimer(){
    if(timeLeft <= 0){
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText=timeLeft;
}
function shuffleCards(){
    timeLeft = maxTime;
    flips = matchedCards = 0;
    cardOne = cardTwo = ""
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;
    const imagePaths = ["card2.jpg","card3.jpg","card4.jpg","card5.jpg","card6.jpg","card7.jpg","card2.jpg","card3.jpg","card4.jpg","card5.jpg","card6.jpg","card7.jpg"];
    shuffleArray(imagePaths);
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let image = card.querySelector(".back-view img");
        image.src = imagePaths[index];
        card.addEventListener("click", flipCard);
    });
}
function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        flipSound.play(); // Play flip sound

        if (!cardOne) {
            return (cardOne = clickedCard);
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImage = cardOne.querySelector(".back-view img").src;
        let cardTwoImage = cardTwo.querySelector(".back-view img").src;

        matchCards(cardOneImage, cardTwoImage);
    }
}
function matchCards(image1, image2) {
    if (image1 === image2) {
        matchedCards++;
        if (matchedCards === 6 && timeLeft > 0) {
            clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disableDeck = false;
        matchSound.play();
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
            wrongSound.play();
        }, 400);
        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = "";
            disableDeck = false;
        }, 1200);
    }
}
refreshBtn.addEventListener("click", initGame);
cards.forEach((card) => {
    card.addEventListener("click", flipCard);
});
document.addEventListener("DOMContentLoaded", function () {
    initGame();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}