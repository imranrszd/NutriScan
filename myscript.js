const progressBar2 = document.getElementById("progress2");

const nextQuestion = document.getElementById("next-question");
const secQuestion = document.getElementById("second-question");
const submitButton = document.getElementById("submit-button");

nextQuestion.addEventListener("click", function (event) {
    progressBar2.style.backgroundColor = "#24A850";
    progressBar2.style.border = "1px solid #24A850";
    secQuestion.style.display = "flex";
});

const form = document.querySelector("form");

form.addEventListener("input", function () {
    nextQuestion.disabled = !form.checkValidity();
});

const radioInputs = document.querySelectorAll('input[type="radio"]');
const radioNames = [...new Set([...radioInputs].map(r => r.name))];

document.querySelector('form').addEventListener('change', function () {
    const allAnswered = radioNames.every(name =>
        document.querySelector(`input[name="${name}"]:checked`)
    );
    submitButton.disabled = !allAnswered;
});

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop real submission

    // Get values at once:
    const age = form.querySelector('input[name="age"]').value;
    const ageUnit = form.querySelector('select[name="measurement"]').value;

    const weight = form.querySelector('input[name="weight"]').value;
    const weightUnit = form.querySelector('select[name="weight-unit"]').value;

    const height = form.querySelector('input[name="height"]').value;
    const heightUnit = form.querySelector('select[name="height-unit"]').value;

    const muac = form.querySelector('input[name="muac"]').value;
    const muacUnit = form.querySelector('select[name="muac-unit"]').value;

    // const gender = answers.gender; // you already store this on click
    const gender = form.querySelector('input[name="gender"]:checked')?.value;
    const hairThinning = form.querySelector('input[name="hair-thinning"]:checked')?.value;

    // Store in one object
    const answers = {
        age, ageUnit,
        weight, weightUnit,
        height, heightUnit,
        muac, muacUnit,
        gender,
        symptoms: {
            "hair-thinning": hairThinning
        }
    };

    var type;
    var confidence;

    if (age > 1 && hairThinning == "yes") {
        confidence = 90;
        type = "Your child is at risk of malnutrition.";
    } else if (age > 1 && hairThinning == "uncertain") {
        confidence = 70;
        type = "Your child may be at risk of malnutrition. Please consult a healthcare professional for further assessment.";
    } else {
        confidence = 80;
        type = "Your child is not at risk of malnutrition.";
    }

    const result = {
        type,
        confidence
    };

    localStorage.setItem("result", JSON.stringify(result));

    console.log(answers);

    window.location.href = "../output.html";
});