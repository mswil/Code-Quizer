const headerEl = document.querySelector("header");

const highScoreBtn = document.querySelector("#high-score-btn");

const startView = document.querySelector("#start-view");
const startBtn = document.querySelector("#start-btn");

const questionView = document.querySelector("#question-view");
const showResult = document.querySelector("#result");
const showWrong = document.querySelector("#wrong");
const showCorrect = document.querySelector("#correct");

const endView = document.querySelector("#end-view");
const userScoreEl = document.querySelector("#user-score")
const userInitials = document.querySelector("#initials");
const initialsBtn = document.querySelector("#initials-btn");

const highScoreView = document.querySelector("#high-score-view");
const highScoreListEl = document.querySelector("#high-score-list");
const goBackBtn = document.querySelector("#restart");
const clearScoreBtn = document.querySelector("#clear-scores");

const timerEl = document.querySelector("#timer");

const questions = [
    {
        questionText: "q1",
        choices: ["1", "2", "3", "4"],
        answerIndex: 2
    },
    {
        questionText: "q2",
        choices: ["1", "2", "3", "4"],
        answerIndex: 3
    },
    {
        questionText: "q3",
        choices: ["1", "2", "3", "4"],
        answerIndex: 0
    }
];

let isPaused = false;
let timeInterval = null;

//initialized in setupGame()
let lastViewedScreen;
let currentQuestion;
let userScore;
let timeLeft;
let pointsForCorrectAnswer;
let timePenalty;

const setupGame = function () {
    lastViewedScreen = "start";

    userScore = 0;
    currentQuestion = -1;
    timeLeft = 20;
    timerEl.textContent = timeLeft;

    pointsForCorrectAnswer = 10;
    timePenalty = 10;
};

const startGame = function () {
    console.log("game started");

    //initialize score, question, and timer
    setupGame();

    //start timer
   // countdown();
    
    //hide instructions
    startView.classList.add("hidden");

    //ask first question
    nextScreen();
};

const nextScreen = function () {
    console.log("next screen");

    lastViewedScreen = "question";

    removeQuestionEl();

    currentQuestion++;
    //end game if we are out of questions
    if (!questions[currentQuestion]) {
        console.log("END GAME");
        endGame();
        return;
    }

    //ask next question
    const newQuestion = createQuestionEl(questions[currentQuestion]);
    questionView.appendChild(newQuestion);

};

const createQuestionEl = function (question) {

    //create div for question
    const questionDiv = document.createElement("div");
    questionDiv.setAttribute("id", "question")
    questionDiv.classList.add("question");

    //create h1 which will contain the question
    const questionEl = document.createElement("h1");
    questionEl.textContent = question.questionText;

    questionDiv.appendChild(questionEl);

    //create a button for each choice
    for (let i = 0; i < question.choices.length; i++) {
        const choiceEl = createChoiceEl(question.choices[i], i);
        questionDiv.appendChild(choiceEl);
    }

    return questionDiv;
};

const removeQuestionEl = function () {
    //get rid of old question
    const oldQuestion = document.querySelector("#question");

    if (oldQuestion) {
        oldQuestion.remove();
    }
};

const createChoiceEl = function (choice, choiceIndex) {
    const choiceEl = document.createElement("button");
    choiceEl.setAttribute("type", "button");
    choiceEl.className = "button choice";
    choiceEl.textContent = choice;

    //Keep track of what index this choice is so we can compare to the answerIndex later
    choiceEl.setAttribute("data-choice-index", choiceIndex);

    choiceEl.addEventListener("click", selectedAChoice);

    return choiceEl;
};

const selectedAChoice = function (event) {

    const choiceIndex = +event.target.getAttribute("data-choice-index");
    showResult.classList.remove("hidden");

    if (choiceIndex === questions[currentQuestion].answerIndex) {
        console.log("good job");
        //add points to score
        userScore += pointsForCorrectAnswer;
        //display correct
        showWrong.classList.add("hidden");
        showCorrect.classList.remove("hidden");
    }
    else {
        console.log("try harder next time");
        //subtract seconds from time
        timeLeft -= timePenalty;
        //display wrong
        showWrong.classList.remove("hidden");
        showCorrect.classList.add("hidden");
    }

    nextScreen();
};

const endGame = function () {
    console.log("the game has ended");
    clearInterval(timeInterval);
    endView.classList.remove("hidden");
    headerEl.classList.add("invisable");
    userScoreEl.textContent = userScore;

    lastViewedScreen = "end";

    console.log(timeInterval);
};

const submitScore = function () {
    saveScore();
    userInitials.value = "";
    showResult.classList.add("hidden");
    showHighScores();
};

const saveScore = function () {
    let highScores = loadScores();
    const scoreObj = {
        name: userInitials.value,
        score: userScore
    };

    highScores.push(scoreObj);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    highScores = [];
};

const loadScores = function () {
    let savedHighScores = localStorage.getItem("highScores");

    if (!savedHighScores) {
        return [];
    }

    return JSON.parse(savedHighScores);
};

const showHighScores = function () {

    //which screen are we hiding
    switch (lastViewedScreen) {
        case "end":
            endView.classList.add("hidden");
            headerEl.classList.remove("invisable");
            break;
        case "start":
            startView.classList.add("hidden");
            break;
        case "question":
            //hide question
            const questionView = document.querySelector("#question");
            questionView.classList.add("hidden");
            isPaused = true;
            break;
        default:
    }

    headerEl.classList.add("invisable");
    highScoreView.classList.remove("hidden");

    let highScores = loadScores();

    highScores.sort(function (a, b) {
        return b.score - a.score;
    });

    //display at most the top 10 high scores
    for (let i = 0; i < Math.min(highScores.length, 10); i++) {
        const scoreEl = document.createElement("li");
        scoreEl.textContent = highScores[i].name + " - " + highScores[i].score;

        highScoreListEl.appendChild(scoreEl);
    }
};

const goBack = function () {

    highScoreListEl.innerHTML = "";
    highScoreView.classList.add("hidden");
    headerEl.classList.remove("invisable");

    //which screen are we returning to
    if (lastViewedScreen === "question") {
        //go back to question
        const questionView = document.querySelector("#question");
        questionView.classList.remove("hidden");
        isPaused = false;
    }
    else {
        //go to start screen
        startView.classList.remove("hidden");

        setupGame();
    }
};

const clearScore = function () {
    localStorage.clear();
    highScoreListEl.innerHTML = "";
};

const countdown = function () {
    timeInterval = setInterval(function () {
        if (timeLeft > 0) {
            if (!isPaused) {
                timerEl.textContent = timeLeft;
                timeLeft--;
            }
        }
        else {
            removeQuestionEl();
            endGame();
        }
        console.log(timeLeft);
    }, 1000);
}

setupGame();

highScoreBtn.addEventListener("click", showHighScores);
startBtn.addEventListener("click", startGame);
initialsBtn.addEventListener("click", submitScore);
goBackBtn.addEventListener("click", goBack);
clearScoreBtn.addEventListener("click", clearScore);

