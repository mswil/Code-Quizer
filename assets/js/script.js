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

    //create h1 which will contain the question
    const questionEl = document.createElement("h1");
    questionEl.textContent = question.questionText;

    questionDiv.appendChild(questionEl);

    //TODO make display in random order
    for (let i = 0; i < question.choices.length; i++) {
        const choiceEl = createChoiceEl(question.choices[i], i);
        questionDiv.appendChild(choiceEl);
    }

    return questionDiv;
};

const createChoiceEl = function (choice, choiceIndex) {
    const choiceEl = document.createElement("button");
    choiceEl.setAttribute("type", "button");
    choiceEl.setAttribute("data-choice-index", choiceIndex);
    choiceEl.textContent = choice;
    choiceEl.addEventListener("click", selectedChoice);
    return choiceEl;
};

const startGame = function () {
    console.log("game started");
    startView.style.display = "none";
    const questionEl = createQuestionEl(questions[0]);
    mainEl.appendChild(questionEl);

};

const selectedChoice = function (event) {
    const choiceIndex = +event.target.getAttribute("data-choice-index");
    if (choiceIndex === questions[currentQuestion].answerIndex) {
        //correct conditions
        console.log("good job");
    }
    else {
        //wrong conditions
        console.log("try harder next time");
    }
};

startBtn.addEventListener("click", startGame);


//event.target thing for when user selects choice