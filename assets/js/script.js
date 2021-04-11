var questions = [
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

var createQuestionEl = function (question) {

    //create div for question
    let questionDiv = document.createElement("div");

    //create h1 which will contain the question
    let questionEl = document.createElement("h1");
    questionEl.textContent = question.questionText;

    questionDiv.appendChild(questionEl);

    //TODO make display in random order
    for (let i = 0; i < question.choices.length; i++) {
        const choiceEl = createChoiceEl(question.choices[i], i);
        questionDiv.appendChild(choiceEl);
    }

    return questionDiv;
}

var createChoiceEl = function (choice, choiceIndex) {
    let choiceEl = document.createElement("button");
    choiceEl.setAttribute("type", "button");
    choiceEl.setAttribute("data-choice-index", choiceIndex);
    choiceEl.textContent = choice;
    return choiceEl;
}

