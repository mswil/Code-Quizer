const mainEl = document.querySelector("main");

const startView = document.querySelector("#start-view");
const startBtn = document.querySelector("#start-btn");

const endView = document.querySelector("#end-view");
const userScore = document.querySelector("#user-score")
const initialsBtn = document.querySelector("#initials-btn");

const highScoreView = document.querySelector("#high-score-view");
const highScoreListEl = document.querySelector("#high-score-list");
const restartBtn = document.querySelector("#restart");
const clearScoreBtn = document.querySelector("#clear-scores");

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

let currentQuestion = 0;

let score = 0;

const createQuestionEl = function (question) {

    //create div for question
    const questionDiv = document.createElement("div");
    questionDiv.setAttribute("id", "question")

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

const createChoiceEl = function (choice, choiceIndex) {
    const choiceEl = document.createElement("button");
    choiceEl.setAttribute("type", "button");
    choiceEl.textContent = choice;

    //Keep track of what index this choice is so we can compare to the answerIndex later
    choiceEl.setAttribute("data-choice-index", choiceIndex);

    choiceEl.addEventListener("click", selectedChoice);

    return choiceEl;
};

const startGame = function () {
    console.log("game started");

    //initialize score to 0
    score = 0;

    //hide instructions
    startView.classList.add("hidden");

    //ask first question
    nextScreen();
};

const selectedChoice = function (event) {

    const choiceIndex = +event.target.getAttribute("data-choice-index");

    if (choiceIndex === questions[currentQuestion].answerIndex) {
        console.log("good job");
        //add 10 points to score
        score += 10;
        //TODO display correct
    }
    else {
        console.log("try harder next time");
        //TODO subtract from time
        //TODO display wrong
    }

    nextScreen();
};

const nextScreen = function () {

    //get rid of old question
    const oldQuestion = document.querySelector("#question");

    if (oldQuestion) {
        oldQuestion.remove();
    }

    //end game if we are out of questions
    if (!questions[currentQuestion]) {
        console.log("END GAME");
        endGame();
        return;
    }

    //ask next question
    const newQuestion = createQuestionEl(questions[currentQuestion]);
    mainEl.appendChild(newQuestion);

    currentQuestion++;
};

const endGame = function () {
    //TODO stop countdown if haven't already
    endView.classList.remove("hidden");
    userScore.textContent = score;

};

const showHighScores = function () {
    endView.classList.add("hidden");
    highScoreView.classList.remove("hidden");


};

startBtn.addEventListener("click", startGame);
initialsBtn.addEventListener("click", showHighScores);

