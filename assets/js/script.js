const mainEl = document.querySelector("main");
const startBtn = document.querySelector("#start-btn");
const startView = document.querySelector("#start-view");

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
    //hide instructions
    startView.style.display = "none";

    //ask first question
    const questionEl = createQuestionEl(questions[currentQuestion]);
    mainEl.appendChild(questionEl);

};

const selectedChoice = function (event) {

    const choiceIndex = +event.target.getAttribute("data-choice-index");

    if (choiceIndex === questions[currentQuestion].answerIndex) {
        console.log("good job");
        //TODO add to score
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

    currentQuestion++;

    //end game if we are out of questions
    if (!questions[currentQuestion]) {
        console.log("END GAME");
        endGame();
        return;
    }
    //get rid of old question
    const oldQuestion = document.querySelector("#question");
    oldQuestion.remove();

    //ask next question
    const newQuestion = createQuestionEl(questions[currentQuestion]);
    mainEl.appendChild(newQuestion);

};

startBtn.addEventListener("click", startGame);

