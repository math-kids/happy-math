// ========================================
// MATH KIDS
// ========================================

let selectedClass = null;
let selectedExercise = null;

let score = 0;
let questionNumber = 0;

const totalQuestions = 10;

let correctAnswer = null;
let answering = false;


// ========================================
// ELEMENTS
// ========================================

const classMenu =
    document.getElementById("class-menu");

const exerciseMenu =
    document.getElementById("exercise-menu");

const gameScreen =
    document.getElementById("game-screen");

const resultScreen =
    document.getElementById("result-screen");

const selectedClassElement =
    document.getElementById("selected-class");

const gameClassNumberElement =
    document.getElementById("game-class-number");

const exerciseTitleElement =
    document.getElementById("exercise-title");

const exerciseNumberElement =
    document.getElementById("exercise-number");

const questionElement =
    document.getElementById("question");

const scoreElement =
    document.getElementById("score");

const menuScoreElement =
    document.getElementById("menu-score");

const progressElement =
    document.getElementById("progress");

const finalScoreElement =
    document.getElementById("final-score");

const mimiElement =
    document.getElementById("mimi");

const mimiText =
    document.getElementById("mimi-text");

// Bisa juga menangani versi HTML lama
const mimiMessageFallback =
    document.getElementById("mimi-message");

const mimiMessage =
    document.querySelector(".mimi-message") ||
    document.querySelector(".mimi-bubble");

const answerButtons =
    document.querySelectorAll(".answers button");

const classButtons =
    document.querySelectorAll(".class-button");

const exerciseButtons =
    document.querySelectorAll(".exercise-button");

const backToClassButton =
    document.getElementById("back-to-class");

const backToExerciseButton =
    document.getElementById("back-to-exercise");

const playAgainButton =
    document.getElementById("play-again");


// ========================================
// JUDUL LATIHAN
// ========================================

const exerciseTitles = {

    1: "🌿 Menghitung Benda di Alam",

    2: "🔢 Nilai Tempat",

    3: "➕ Penjumlahan Puluhan",

    4: "➖ Pengurangan Puluhan"

};


// ========================================
// PILIH KELAS
// ========================================

classButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectedClass =
            Number(button.dataset.class);

        if (selectedClass !== 2) {

            alert(
                `🎒 Kelas ${selectedClass} SD akan segera hadir!`
            );

            return;
        }

        selectedClassElement.textContent =
            selectedClass;

        if (gameClassNumberElement) {

            gameClassNumberElement.textContent =
                selectedClass;

        }

        classMenu.classList.add("hidden");

        exerciseMenu.classList.remove("hidden");

    });

});


// ========================================
// PILIH LATIHAN
// ========================================

exerciseButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectedExercise =
            Number(button.dataset.exercise);

        startExercise();

    });

});


// ========================================
// MULAI LATIHAN
// ========================================

function startExercise() {

    score = 0;
    questionNumber = 0;
    answering = false;

    scoreElement.textContent = score;

    if (menuScoreElement) {
        menuScoreElement.textContent = score;
    }

    exerciseMenu.classList.add("hidden");

    resultScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    exerciseTitleElement.textContent =
        exerciseTitles[selectedExercise];

    if (exerciseNumberElement) {

        exerciseNumberElement.textContent =
            selectedExercise;

    }

    setMimiMessage(
        "Ayo pilih jawabanmu 🌿"
    );

    generateQuestion();

}


// ========================================
// GENERATE SOAL
// ========================================

function generateQuestion() {

    answering = false;

    questionNumber++;

    progressElement.textContent =
        `Soal ${questionNumber} / ${totalQuestions}`;

    resetMimi();


    if (selectedExercise === 1) {

        generateCountingQuestion();

    }

    else if (selectedExercise === 2) {

        generatePlaceValueQuestion();

    }

    else if (selectedExercise === 3) {

        generateAdditionQuestion();

    }

    else if (selectedExercise === 4) {

        generateSubtractionQuestion();

    }

}


// ========================================
// LATIHAN 1
// MENGHITUNG BENDA
// ========================================

function generateCountingQuestion() {

    const objects = [
        "🍎",
        "🌸",
        "🍃",
        "🪨",
        "🐚",
        "🌰"
    ];

    const object =
        objects[
            Math.floor(
                Math.random() * objects.length
            )
        ];

    const amount =
        Math.floor(
            Math.random() * 8
        ) + 2;

    correctAnswer = amount;


    const objectHTML =
        Array.from(
            { length: amount },
            () =>
                `<span class="counting-object">${object}</span>`
        ).join("");


    questionElement.innerHTML = `

        <div class="counting-objects">
            ${objectHTML}
        </div>

        <div> = ?</div>

    `;


    showNormalAnswers(
        correctAnswer,
        "normal"
    );

}


// ========================================
// LATIHAN 2
// NILAI TEMPAT
// ========================================

function generatePlaceValueQuestion() {

    const tens =
        Math.floor(
            Math.random() * 5
        ) + 1;

    const ones =
        Math.floor(
            Math.random() * 10
        );

    const number =
        tens * 10 + ones;


    correctAnswer = {

        tens: tens,
        ones: ones

    };


    let tensHTML = "";

    for (
        let i = 0;
        i < tens;
        i++
    ) {

        tensHTML += `

            <div class="tens-block">

                ${Array.from(
                    { length: 10 },
                    () => `<span></span>`
                ).join("")}

            </div>

        `;

    }


    let onesHTML = "";

    for (
        let i = 0;
        i < ones;
        i++
    ) {

        onesHTML += `
            <span class="ones-block"></span>
        `;

    }


    questionElement.innerHTML = `

        <div class="place-value-question">

            <div class="blocks-area">

                <div class="tens-area">
                    ${tensHTML}
                </div>

                <div class="ones-area">
                    ${onesHTML}
                </div>

            </div>

            <div class="place-number-preview">
                Bilangan:
                <strong>${number}</strong>
            </div>

            <div class="place-instruction">

                Berapa
                <strong>puluhan</strong>
                dan
                <strong>satuan</strong>?

            </div>

        </div>

    `;


    createPlaceValueAnswers();

}


// ========================================
// PILIHAN NILAI TEMPAT
// ========================================

function createPlaceValueAnswers() {

    restoreNormalAnswerArea();

    const correctTens =
        correctAnswer.tens;

    const correctOnes =
        correctAnswer.ones;


    let answers = [

        {
            tens: correctTens,
            ones: correctOnes
        },

        {
            tens: correctTens - 1,
            ones: correctOnes
        },

        {
            tens: correctTens + 1,
            ones: correctOnes
        },

        {
            tens: correctOnes,
            ones: correctTens
        }

    ];


    answers =
        answers.filter(
            (answer, index, self) => {

                if (answer.tens < 1) {
                    return false;
                }

                return index ===
                    self.findIndex(
                        item =>
                            item.tens === answer.tens &&
                            item.ones === answer.ones
                    );

            }
        );


    while (
        answers.length < 4
    ) {

        const randomTens =
            Math.floor(
                Math.random() * 5
            ) + 1;

        const randomOnes =
            Math.floor(
                Math.random() * 10
            );


        const exists =
            answers.some(
                answer =>
                    answer.tens === randomTens &&
                    answer.ones === randomOnes
            );


        if (!exists) {

            answers.push({

                tens: randomTens,
                ones: randomOnes

            });

        }

    }


    answers.sort(
        () => Math.random() - 0.5
    );


    answerButtons.forEach(
        (button, index) => {

            const answer =
                answers[index];

            button.disabled = false;

            button.textContent =
                `${answer.tens} puluhan + ${answer.ones} satuan`;


            button.onclick = () => {

                checkPlaceValueAnswer(
                    answer
                );

            };

        }
    );

}


// ========================================
// CEK NILAI TEMPAT
// ========================================

function checkPlaceValueAnswer(answer) {

    if (answering) {
        return;
    }


    const isCorrect =
        answer.tens === correctAnswer.tens &&
        answer.ones === correctAnswer.ones;


    if (isCorrect) {

        answering = true;

        score += 10;

        scoreElement.textContent =
            score;

        if (menuScoreElement) {

            menuScoreElement.textContent =
                score;

        }


        setMimiMessage(
            "Hebat! Jawabanmu benar! 🎉"
        );


        removeWrongMessage();


        mimiElement.classList.remove(
            "wrong",
            "correct"
        );


        void mimiElement.offsetWidth;


        mimiElement.classList.add(
            "correct"
        );


        answerButtons.forEach(
            button => {
                button.disabled = true;
            }
        );


        setTimeout(() => {

            nextQuestion();

        }, 800);


    }

    else {

        setMimiMessage(
            "Belum tepat. Coba lagi! 💪"
        );


        addWrongMessage();


        mimiElement.classList.remove(
            "correct",
            "wrong"
        );


        void mimiElement.offsetWidth;


        mimiElement.classList.add(
            "wrong"
        );

    }

}


// ========================================
// LATIHAN 3
// PENJUMLAHAN PULUHAN
// ========================================

function generateAdditionQuestion() {

    const tens1 =
        Math.floor(
            Math.random() * 6
        ) + 2;

    const tens2 =
        Math.floor(
            Math.random() * 6
        ) + 1;


    const number1 =
        tens1 * 10;

    const number2 =
        tens2 * 10;


    correctAnswer =
        number1 + number2;


    createTensWorksheet(
        number1,
        number2,
        "+",
        correctAnswer
    );

}


// ========================================
// LATIHAN 4
// PENGURANGAN PULUHAN
// ========================================

function generateSubtractionQuestion() {

    const bigTens =
        Math.floor(
            Math.random() * 5
        ) + 5;

    const smallTens =
        Math.floor(
            Math.random() * (
                bigTens - 2
            )
        ) + 1;


    const number1 =
        bigTens * 10;

    const number2 =
        smallTens * 10;


    correctAnswer =
        number1 - number2;


    createTensWorksheet(
        number1,
        number2,
        "−",
        correctAnswer
    );

}


// ========================================
// WORKSHEET PULUHAN
// LATIHAN 3 & 4
// ========================================

// ========================================
// WORKSHEET PULUHAN
// LATIHAN 3 & 4
// ========================================

function createTensWorksheet(
    number1,
    number2,
    operator,
    answer
) {

    hideNormalAnswerArea();


    const tens1 =
        number1 / 10;

    const tens2 =
        number2 / 10;


    // ========================================
    // BALOK PERTAMA
    // ========================================

    let firstBlocks = "";

    for (
        let i = 0;
        i < tens1;
        i++
    ) {

        firstBlocks += `
            <div class="digital-tens-block">
                ${createTenSegments()}
            </div>
        `;

    }


    // ========================================
    // BALOK KEDUA
    // ========================================

    let secondBlocks = "";

    for (
        let i = 0;
        i < tens2;
        i++
    ) {

        secondBlocks += `
            <div class="digital-tens-block">
                ${createTenSegments()}
            </div>
        `;

    }


    const theme =
        operator === "+"
            ? "addition"
            : "subtraction";


    const instruction =
        operator === "+"
            ? "Hitung jumlah balok berikut! Ketik hasilnya."
            : "Hitung sisa balok berikut! Ketik hasilnya.";


    // ========================================
    // TAMPILKAN SOAL
    // ========================================

    questionElement.innerHTML = `

        <div class="tens-worksheet ${theme}">

            <div class="worksheet-instruction">
                ${instruction}
            </div>


            <!-- PERSAMAAN -->

            <div class="tens-equation">

                <div class="tens-group">

                    <div class="digital-blocks">
                        ${firstBlocks}
                    </div>

                    <strong>
                        ${number1}
                    </strong>

                </div>


                <div class="big-operator">
                    ${operator}
                </div>


                <div class="tens-group">

                    <div class="digital-blocks">
                        ${secondBlocks}
                    </div>

                    <strong>
                        ${number2}
                    </strong>

                </div>


                <div class="big-equals">
                    =
                </div>

            </div>


            <!-- =================================
                 JAWABAN KETIK
                 ================================= -->

            <div class="typed-answer-row">

    <input
        id="typed-answer"
        class="typed-answer"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="3"
        placeholder="?"
        aria-label="Ketik jawaban"
    >

    <button
        id="check-writing"
        class="check-writing ${theme}"
        type="button"
    >
        Cek Jawaban
        <span>▶</span>
    </button>

</div>


            <div class="typed-answer-hint">
                🔢 Ketik jawabanmu di kotak
            </div>

        </div>

    `;


    setupTypedAnswer(answer);

}


// ========================================
// INPUT JAWABAN KETIK
// ========================================

function setupTypedAnswer(answer) {

    const input =
        document.getElementById(
            "typed-answer"
        );


    const checkButton =
        document.getElementById(
            "check-writing"
        );


    if (!input || !checkButton) {
        return;
    }


    // ========================================
    // HANYA BOLEH ANGKA
    // ========================================

    input.addEventListener(
        "input",
        () => {

            input.value =
                input.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );


    // ========================================
    // CEK JAWABAN
    // ========================================

    checkButton.addEventListener(
        "click",
        () => {

            checkTypedAnswer(answer);

        }
    );


    // ========================================
    // ENTER = CEK
    // ========================================

    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                checkTypedAnswer(answer);

            }

        }
    );


    // Fokus otomatis
    setTimeout(
        () => {

            input.focus();

        },
        100
    );

}


// ========================================
// CEK JAWABAN KETIK
// ========================================

function checkTypedAnswer(answer) {

    if (answering) {
        return;
    }


    const input =
        document.getElementById(
            "typed-answer"
        );


    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    // ========================================
    // KOSONG
    // ========================================

    if (!value) {

        setMimiMessage(
            "Ketik jawabannya dulu ya 🔢"
        );


        mimiElement.classList.remove(
            "correct",
            "wrong"
        );


        void mimiElement.offsetWidth;


        mimiElement.classList.add(
            "wrong"
        );


        input.focus();

        return;

    }


    const userAnswer =
        Number(value);


    // ========================================
    // BENAR
    // ========================================

    if (
        userAnswer ===
        Number(answer)
    ) {

        checkTypedCorrect();

        return;

    }


    // ========================================
    // SALAH
    // ========================================

    checkTypedWrong();

}


// ========================================
// JAWABAN BENAR
// ========================================

function checkTypedCorrect() {

    if (answering) {
        return;
    }


    answering = true;


    score += 10;


    scoreElement.textContent =
        score;


    if (menuScoreElement) {

        menuScoreElement.textContent =
            score;

    }


    setMimiMessage(
        "Hebat! Jawabanmu benar! 🎉"
    );


    removeWrongMessage();


    mimiElement.classList.remove(
        "wrong",
        "correct"
    );


    void mimiElement.offsetWidth;


    mimiElement.classList.add(
        "correct"
    );


    const input =
        document.getElementById(
            "typed-answer"
        );


    const checkButton =
        document.getElementById(
            "check-writing"
        );


    if (input) {

        input.disabled =
            true;

    }


    if (checkButton) {

        checkButton.disabled =
            true;

        checkButton.innerHTML =
            "Benar! 🎉";

    }


    setTimeout(
        () => {

            nextQuestion();

        },
        900
    );

}


// ========================================
// JAWABAN SALAH
// ========================================

function checkTypedWrong() {

    setMimiMessage(
        "Belum tepat. Coba lagi! 💪"
    );


    addWrongMessage();


    mimiElement.classList.remove(
        "correct",
        "wrong"
    );


    void mimiElement.offsetWidth;


    mimiElement.classList.add(
        "wrong"
    );


    const input =
        document.getElementById(
            "typed-answer"
        );


    if (input) {

        input.focus();

        input.select();

    }

}// ========================================
// 10 SEGMENT BALOK
// ========================================

function createTenSegments() {

    let segments = "";

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        segments += `
            <span></span>
        `;

    }

    return segments;

}


// ========================================
// INPUT JAWABAN LATIHAN 3 & 4
// ========================================

function setupTypedAnswer(answer) {

    const input =
        document.getElementById(
            "typed-answer"
        );

    const clearButton =
        document.getElementById(
            "clear-answer"
        );

    const checkButton =
        document.getElementById(
            "check-writing"
        );


    if (!input) {
        return;
    }


    // ========================================
    // HANYA BOLEH ANGKA
    // ========================================

    input.addEventListener(
        "input",
        () => {

            input.value =
                input.value.replace(
                    /[^0-9]/g,
                    ""
                );

        }
    );


    // ========================================
    // TOMBOL HAPUS
    // ========================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                input.value = "";

                input.focus();

            }
        );

    }


    // ========================================
    // TOMBOL CEK JAWABAN
    // ========================================

    if (checkButton) {

        checkButton.addEventListener(
            "click",
            () => {

                checkTypedAnswer(answer);

            }
        );

    }


    // ========================================
    // ENTER = CEK JAWABAN
    // ========================================

    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                checkTypedAnswer(answer);

            }

        }
    );


    // Langsung fokus ke input
    setTimeout(
        () => {
            input.focus();
        },
        100
    );

}


// ========================================
// CEK JAWABAN KETIK
// ========================================

function checkTypedAnswer(answer) {

    if (answering) {
        return;
    }


    const input =
        document.getElementById(
            "typed-answer"
        );

    const checkButton =
        document.getElementById(
            "check-writing"
        );


    if (!input) {
        return;
    }


    const userValue =
        input.value.trim();


    // ========================================
    // BELUM DIISI
    // ========================================

    if (!userValue) {

        setMimiMessage(
            "Ketik jawabannya dulu ya 🔢"
        );

        input.focus();

        return;

    }


    const numericAnswer =
        Number(userValue);


    // ========================================
    // JAWABAN BENAR
    // ========================================

    if (
        numericAnswer ===
        Number(answer)
    ) {

        checkTypedCorrect();

        return;

    }


    // ========================================
    // JAWABAN SALAH
    // ========================================

    checkTypedWrong();

}


// ========================================
// JAWABAN KETIK BENAR
// ========================================

function checkTypedCorrect() {

    if (answering) {
        return;
    }


    answering = true;


    score += 10;


    scoreElement.textContent =
        score;


    if (menuScoreElement) {

        menuScoreElement.textContent =
            score;

    }


    setMimiMessage(
        "Hebat! Jawabanmu benar! 🎉"
    );


    removeWrongMessage();


    mimiElement.classList.remove(
        "wrong",
        "correct"
    );


    void mimiElement.offsetWidth;


    mimiElement.classList.add(
        "correct"
    );


    const input =
        document.getElementById(
            "typed-answer"
        );


    const checkButton =
        document.getElementById(
            "check-writing"
        );


    const clearButton =
        document.getElementById(
            "clear-answer"
        );


    if (input) {
        input.disabled = true;
    }


    if (clearButton) {
        clearButton.disabled = true;
    }


    if (checkButton) {

        checkButton.disabled = true;

        checkButton.innerHTML =
            "Benar! 🎉";

    }


    setTimeout(
        () => {

            nextQuestion();

        },
        900
    );

}


// ========================================
// JAWABAN KETIK SALAH
// ========================================

function checkTypedWrong() {

    setMimiMessage(
        "Belum tepat. Coba lagi! 💪"
    );


    addWrongMessage();


    mimiElement.classList.remove(
        "correct",
        "wrong"
    );


    void mimiElement.offsetWidth;


    mimiElement.classList.add(
        "wrong"
    );


    const input =
        document.getElementById(
            "typed-answer"
        );


    const checkButton =
        document.getElementById(
            "check-writing"
        );


    if (checkButton) {

        checkButton.disabled = false;

        checkButton.innerHTML =
            'Coba Lagi <span>↻</span>';

    }


    if (input) {

        input.focus();

        input.select();

    }

}
// ========================================
// NEXT QUESTION
// ========================================

function nextQuestion() {

    if (
        questionNumber >=
        totalQuestions
    ) {

        showResult();

    }

    else {

        generateQuestion();

    }

}


// ========================================
// MODE JAWABAN BIASA
// ========================================

function showNormalAnswers(
    answer,
    type
) {

    restoreNormalAnswerArea();


    let answers = [answer];


    while (
        answers.length < 4
    ) {

        let wrongAnswer;


        if (type === "tens") {

            wrongAnswer =
                answer +
                (
                    Math.floor(
                        Math.random() * 7
                    ) - 3
                ) * 10;

        }

        else {

            wrongAnswer =
                answer +
                Math.floor(
                    Math.random() * 7
                ) - 3;

        }


        if (
            wrongAnswer >= 0 &&
            !answers.includes(
                wrongAnswer
            )
        ) {

            answers.push(
                wrongAnswer
            );

        }

    }


    answers.sort(
        () =>
            Math.random() - 0.5
    );


    answerButtons.forEach(
        (button, index) => {

            button.disabled = false;

            button.textContent =
                answers[index];


            button.onclick = () => {

                checkAnswer(
                    answers[index]
                );

            };

        }
    );

}


// ========================================
// CEK JAWABAN BIASA
// ========================================

function checkAnswer(answer) {

    if (answering) {
        return;
    }


    if (
        answer ===
        correctAnswer
    ) {

        answering = true;

        score += 10;


        scoreElement.textContent =
            score;


        if (menuScoreElement) {

            menuScoreElement.textContent =
                score;

        }


        setMimiMessage(
            "Hebat! Jawabanmu benar! 🎉"
        );


        removeWrongMessage();


        mimiElement.classList.remove(
            "wrong",
            "correct"
        );


        void mimiElement.offsetWidth;


        mimiElement.classList.add(
            "correct"
        );


        answerButtons.forEach(
            button => {

                button.disabled = true;

            }
        );


        setTimeout(() => {

            nextQuestion();

        }, 800);

    }

    else {

        setMimiMessage(
            "Belum tepat. Coba lagi! 💪"
        );


        addWrongMessage();


        mimiElement.classList.remove(
            "correct",
            "wrong"
        );


        void mimiElement.offsetWidth;


        mimiElement.classList.add(
            "wrong"
        );

    }

}


// ========================================
// MIMI MESSAGE
// ========================================

function setMimiMessage(message) {

    if (mimiText) {

        mimiText.textContent =
            message;

        return;

    }


    if (mimiMessageFallback) {

        mimiMessageFallback.textContent =
            message;

    }

}


// ========================================
// MIMI WRONG MESSAGE
// ========================================

function addWrongMessage() {

    if (mimiMessage) {

        mimiMessage.classList.add(
            "wrong-message"
        );

    }

}


function removeWrongMessage() {

    if (mimiMessage) {

        mimiMessage.classList.remove(
            "wrong-message"
        );

    }

}


// ========================================
// RESET MIMI
// ========================================

function resetMimi() {

    mimiElement.classList.remove(
        "correct",
        "wrong"
    );


    removeWrongMessage();

}


// ========================================
// SEMBUNYIKAN PILIHAN
// ========================================

function hideNormalAnswerArea() {

    const answersArea =
        document.querySelector(
            ".answers"
        );


    if (answersArea) {

        answersArea.classList.add(
            "hidden"
        );

    }

}


// ========================================
// KEMBALIKAN PILIHAN
// ========================================

function restoreNormalAnswerArea() {

    const answersArea =
        document.querySelector(
            ".answers"
        );


    if (answersArea) {

        answersArea.classList.remove(
            "hidden"
        );

    }

}


// ========================================
// HASIL
// ========================================

function showResult() {

    gameScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.remove(
        "hidden"
    );


    finalScoreElement.textContent =
        `🎯 Nilai kamu: ${score / 10} / ${totalQuestions}`;

}


// ========================================
// KEMBALI KE KELAS
// ========================================

backToClassButton.onclick =
    function () {

        gameScreen.classList.add(
            "hidden"
        );

        exerciseMenu.classList.add(
            "hidden"
        );

        classMenu.classList.remove(
            "hidden"
        );

    };


// ========================================
// KEMBALI KE LATIHAN
// ========================================

backToExerciseButton.onclick =
    function () {

        gameScreen.classList.add(
            "hidden"
        );

        exerciseMenu.classList.remove(
            "hidden"
        );

    };


// ========================================
// MAIN LAGI
// ========================================

playAgainButton.onclick =
    function () {

        resultScreen.classList.add(
            "hidden"
        );

        exerciseMenu.classList.remove(
            "hidden"
        );

    };