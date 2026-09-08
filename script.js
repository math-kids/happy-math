let level = "easy";

let num1;
let num2;
let correctAnswer;

let score = 0;
let questionNumber = 0;
const totalQuestions = 10;


const levelMenu = document.getElementById("level-menu");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
const resultElement = document.getElementById("result");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");
const finalScoreElement = document.getElementById("final-score");

const levelButtons = document.querySelectorAll(".level-button");
const answerButtons = document.querySelectorAll(".answers button");
const playAgainButton = document.getElementById("play-again");


// Pilih level
levelButtons.forEach((button) => {

    button.onclick = function () {

        level = button.dataset.level;

        startGame();

    };

});


// Mulai game
function startGame() {

    score = 0;
    questionNumber = 0;

    scoreElement.textContent = score;

    levelMenu.classList.add("hidden");
    resultScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    generateQuestion();
}


// Buat soal
function generateQuestion() {

    questionNumber++;

    progressElement.textContent =
        `Question ${questionNumber} / ${totalQuestions}`;

    if (level === "easy") {

        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;

        correctAnswer = num1 + num2;

        questionElement.textContent =
            `${num1} + ${num2} = ?`;

    }


    else if (level === "medium") {

        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;

        const subtraction = Math.random() > 0.5;

        if (subtraction && num1 >= num2) {

            correctAnswer = num1 - num2;

            questionElement.textContent =
                `${num1} - ${num2} = ?`;

        } else {

            correctAnswer = num1 + num2;

            questionElement.textContent =
                `${num1} + ${num2} = ?`;

        }

    }


    else if (level === "hard") {

        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;

        correctAnswer = num1 * num2;

        questionElement.textContent =
            `${num1} × ${num2} = ?`;

    }


    createAnswers();

    resultElement.textContent = "";
}


// Buat 4 pilihan jawaban
function createAnswers() {

    let answers = [
        correctAnswer,
        correctAnswer + 1,
        correctAnswer - 1,
        correctAnswer + 2
    ];

    answers.sort(() => Math.random() - 0.5);


    answerButtons.forEach((button, index) => {

        button.textContent = answers[index];

        button.onclick = function () {

            checkAnswer(answers[index]);

        };

    });

}


// Cek jawaban
function checkAnswer(answer) {

    if (answer === correctAnswer) {

        score += 10;

        scoreElement.textContent = score;

        resultElement.textContent = "🎉 Correct!";

        if (questionNumber === totalQuestions) {

            setTimeout(showResult, 700);

        } else {

            setTimeout(generateQuestion, 700);

        }

    } else {

        resultElement.textContent = "❌ Try again!";

    }

}


// Tampilkan hasil akhir
function showResult() {

    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    finalScoreElement.textContent =
        `You scored ${score / 10} / ${totalQuestions}`;

}


// Main lagi
playAgainButton.onclick = function () {

    resultScreen.classList.add("hidden");
    levelMenu.classList.remove("hidden");

};