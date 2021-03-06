const headerEl = document.querySelector("header");

const highScoreBtn = document.querySelector("#high-score-btn");

const startView = document.querySelector("#start-view");
const startBtn = document.querySelector("#start-btn");
const timePenaltyEl = document.querySelector("#time-penalty");

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
        questionText: "Commonly used data types do NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answerIndex: 2
    },
    {
        questionText: "The condition in an if / else statement is enclosed with _______.",
        choices: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        answerIndex: 2
    },
    {
        questionText: "Arrays in JavaScript can be used to store ______.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answerIndex: 3
    },
    {
        questionText: "String values must be enclosed within ___________ when being assigned to variables",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answerIndex: 2
    },
    {
        questionText: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        answerIndex: 3
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
    timeLeft = 75;
    timerEl.textContent = timeLeft;

    pointsForCorrectAnswer = 10;
    timePenalty = 10;
    timePenaltyEl.textContent = timePenalty;
};

//on clicking start button
const startGame = function () {

    //initialize score, question, and timer
    setupGame();

    //start timer
    countdown();

    //hide instructions
    startView.classList.add("hidden");

    //ask first question
    nextScreen();
};

const nextScreen = function () {

    lastViewedScreen = "question";

    removeQuestionEl();

    currentQuestion++;
    //end game if we are out of questions
    if (!questions[currentQuestion]) {
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

//on clicking a choice button
const selectedAChoice = function (event) {

    const choiceIndex = +event.target.getAttribute("data-choice-index");
    showResult.classList.remove("hidden");

    if (choiceIndex === questions[currentQuestion].answerIndex) {
        //add points to score
        userScore += pointsForCorrectAnswer;
        //display correct
        showWrong.classList.add("hidden");
        showCorrect.classList.remove("hidden");
    }
    else {
        //subtract seconds from time
        timeLeft -= timePenalty;
        //display wrong
        showWrong.classList.remove("hidden");
        showCorrect.classList.add("hidden");
    }

    nextScreen();
};

const endGame = function () {

    //end timer
    clearInterval(timeInterval);

    endView.classList.remove("hidden");
    headerEl.classList.add("invisible");

    //display score
    if (timeLeft > 0 && userScore > 0) {
        userScore += timeLeft;
    }
    userScoreEl.textContent = userScore;

    lastViewedScreen = "end";
};

//on clicking submit button
const submitScore = function () {
    if (userInitials.value === "") {
        alert("Please enter your initials!");
    }
    else {
        saveScore();
        showResult.classList.add("hidden");
        showHighScores();
    }
};

const saveScore = function () {
    const highScores = loadScores();

    //create a score object for this session
    const scoreObj = {
        name: userInitials.value,
        score: userScore
    };

    //add this session score to list of scores and save to local storage
    highScores.push(scoreObj);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    //clear out input field for next user. Be kind rewind
    userInitials.value = "";
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
            headerEl.classList.remove("invisible");
            break;
        case "start":
            startView.classList.add("hidden");
            break;
        case "question":
            //hide question
            questionView.classList.add("hidden");
            isPaused = true;
            break;
        default:
    }

    headerEl.classList.add("invisible");
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

//on clicking go back button
const goBack = function () {

    highScoreListEl.innerHTML = "";
    highScoreView.classList.add("hidden");
    headerEl.classList.remove("invisible");

    //which screen are we returning to
    if (lastViewedScreen === "question") {
        //go back to question
        questionView.classList.remove("hidden");
        isPaused = false;
    }
    else {
        //go to start screen
        startView.classList.remove("hidden");

        setupGame();
    }
};

//on clicking clear high score button
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
    }, 1000);
}

setupGame();

highScoreBtn.addEventListener("click", showHighScores);
startBtn.addEventListener("click", startGame);
initialsBtn.addEventListener("click", submitScore);
goBackBtn.addEventListener("click", goBack);
clearScoreBtn.addEventListener("click", clearScore);

