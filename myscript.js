import LMS from './lms.js';

const headQuestion = [
    { id: '1', text: 'Hair Sparse' },
    { id: '2', text: 'Hair Color Change' },
    { id: '3', text: 'Face Elderly' },
    { id: '4', text: 'Eyes Sight Glazed' },
];
const skinQuestion = [
    { id: '5', text: 'Dermatosis' },
    { id: '6', text: 'Wrinkled Skin' },
];
const bodyQuestion = [
    { id: '7', text: 'Edema' },
    { id: '8', text: 'Wasting' },
    { id: '9', text: 'Mild Wasting Signs' },
    { id: '10', text: 'Fatty Liver' },
    { id: '11', text: 'Bloated Stomach' },
    { id: '12', text: 'Concave Stomach' },
];
const behaviorQuestion = [
    { id: '13', text: 'Cranky' },
    { id: '14', text: 'Apathetic' },
];
const healthQuestion = [
    { id: '15', text: 'Infection' },
    { id: '16', text: 'Diarrhea' },
    { id: '17', text: 'Anemic' },
    { id: '18', text: 'Appetite Loss' },
];

createQuestionSection(headQuestion, 'hair-question');
createQuestionSection(skinQuestion, 'skin-question');
createQuestionSection(bodyQuestion, 'body-question');
createQuestionSection(behaviorQuestion, 'behavior-question');
createQuestionSection(healthQuestion, 'health-question');

function createQuestionSection(questions, sectionId) {
    const section = document.getElementById(sectionId);
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
    <div class="radio-question">
        <p>${index + 1}. ${q.text}</p>
        <div class="choices">
        <label id="yes-button"><input type="radio" name="${q.id}" value="yes"> <span>Yes</span></label>
        <hr>
        <label><input type="radio" name="${q.id}" value="uncertain"> <span>Uncertain</span></label>
        <hr>
        <label id="no-button"><input type="radio" name="${q.id}" value="no"> <span>No</span></label>
        </div>
    </div>
  `;
        section.appendChild(div);
    });
}

const heightInput = document.getElementById("height");
const heightRadio = document.getElementById("height-radio");
var heightValue;

heightInput.addEventListener("input", function (event) {
    heightValue = parseFloat(event.target.value) || 0;
});

heightRadio.addEventListener("input", function (event) {
    heightValue = parseFloat(event.target.value) || 0;
});

document.addEventListener("DOMContentLoaded", function () {
    // This runs once when the DOM is fully loaded and parsed.
    nextQuestion.disabled = !form.checkValidity();
    // Do your initialization here: add event listeners, fetch data, etc.
});

// Enable next button only when all inputs are answered
const form = document.querySelector("form");

form.addEventListener("input", function () {
    const isFormValid = form.checkValidity();
    const isHeightValid = heightValue >= 45 && heightValue <= 110;
    nextQuestion.disabled = !(isFormValid && isHeightValid);
});

// Scroll to the second question
const nextQuestion = document.getElementById("next-question");
const progressBar2 = document.getElementById("progress2");
const secQuestion = document.getElementById("second-question");

nextQuestion.addEventListener("click", function (event) {
    progressBar2.style.backgroundColor = "#24A850";
    progressBar2.style.border = "1px solid #24A850";
    secQuestion.style.display = "flex";
});

// Enable submit button only when all radio inputs are answered
const radioInputs = document.querySelectorAll('input[type="radio"]');
const radioNames = [...new Set([...radioInputs].map(r => r.name))];
const submitButton = document.getElementById("submit-button");

document.querySelector('form').addEventListener('change', function () {
    const allAnswered = radioNames.every(name =>
        document.querySelector(`input[name="${name}"]:checked`)
    );
    submitButton.disabled = !allAnswered;
});

// Submit button logic
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop real submission

    // Get values at once:
    const age = form.querySelector('input[name="age"]').value;
    const ageUnit = form.querySelector('select[name="measurement"]').value;

    const gender = form.querySelector('input[name="gender"]:checked')?.value;

    const weight = form.querySelector('input[name="weight"]').value;
    const weightUnit = form.querySelector('select[name="weight-unit"]').value;

    var height = parseFloat(form.querySelector('input[name="height"]').value);
    if (!isNaN(height)) {
        // if (heightUnit == "ft") {
        //     height = height * 30.48
        // }
        const remainder = height % 5;
        if (remainder > 0) {
            if (remainder < 2.5) {
                height = height - remainder; // Round down
            } else {
                height = height + (5 - remainder); // Round up
            }
        }
    }
    const heightUnit = form.querySelector('select[name="height-unit"]').value;

    const muac = form.querySelector('input[name="muac"]').value;
    const muacUnit = form.querySelector('select[name="muac-unit"]').value;

    const questions = {
        headQuestion,
        skinQuestion,
        bodyQuestion,
        behaviorQuestion,
        healthQuestion
    };

    function getSymptomsFromForm(questionCategories) {
        return Object.values(questionCategories).flat().reduce((acc, q) => {
            const key = q.text.toLowerCase().replace(/\s+/g, '');
            acc[key] = form.querySelector(`input[name="${q.id}"]:checked`)?.value;
            return acc;
        }, {});
    }

    // Store in one object
    const answers = {
        age, ageUnit,
        gender,
        weight, weightUnit,
        height, heightUnit,
        muac, muacUnit,
        symptoms: getSymptomsFromForm(questions)
    };

    const result = diagnosis(answers);

    localStorage.setItem("result", JSON.stringify(result));

    console.log(height);
    console.log(countWHZ(gender, weight, height));

    // window.location.href = "output.html";
});

// Diagnosis for symptoms
function diagnosis(x) {
    // 1️⃣ Determine Nutritional Status + Confidence
    let Status = "Uncertain";
    let Confidence = "Low";
    const WHZ = countWHZ(x.gender, x.weight, x.height);

    if (x.symptoms.edema || x.muac < 11.0 || WHZ < -3.0) {
        Status = "SAM";
        Confidence = "High";
    } else if ((x.muac >= 11.0 && x.muac <= 11.4) || (WHZ >= -3.0 && WHZ <= -2.0)) {
        Status = "SAM";
        Confidence = "Medium";
    } else if ((x.muac >= 11.5 && x.muac <= 12.5) || (WHZ >= -3.0 && WHZ <= -2.0)) {
        Status = "MAM";
        Confidence = "High";
    } else if (x.muac > 12.5 && WHZ > -2.0) {
        Status = "Normal";
        Confidence = "High";
    } else if (no_risk_signs && !Conflicting_inputs) {
        Status = "Normal";
        Confidence = "High";
    } else {
        Status = "Uncertain";
        Confidence = "Low";
    }

    // 2️⃣ If SAM → Determine Type + Type Confidence
    let Type = "None";
    let TypeConfidence = "N/A";

    if (Status === "SAM") {
        // Kwashiorkor
        if (
            x.hairsparse && x.haircolorchange &&
            x.dermatosis && x.edema && x.eyessightglazed && x.fattyliver &&
            x.infection && x.apathetic && x.wasting && x.cranky &&
            x.anemic && x.diarrhea
        ) {
            Type = "Kwashiorkor";
            TypeConfidence = "High";
        }
        // Marasmus
        else if (
            x.wasting && x.faceelderly && x.cranky && x.wrinkledskin &&
            x.mildwastingsigns && x.concavestomach && x.infection && x.diarrhea
        ) {
            Type = "Marasmus";
            TypeConfidence = "High";
        }
        // Marasmic-Kwashiorkor
        else if (
            x.hairsparse && x.edema && x.wasting && x.stomachbloated &&
            x.infection && x.fattyliver && x.mildwastingsigns &&
            x.concavestomach && x.wrinkledskin
        ) {
            Type = "Marasmic-Kwashiorkor";
            TypeConfidence = "High";
        }
        // Fallback
        else {
            if (x.edema) {
                Type = "Kwashiorkor";
            } else {
                Type = "Marasmus";
            }
            TypeConfidence = "Medium";
        }
    }

    // 3️⃣ If conflicting inputs, force Uncertain
    // if (Conflicting_inputs) {
    //     Status = "Uncertain";
    //     Confidence = "Low";
    //     Type = "None";
    //     TypeConfidence = "N/A";
    // }

    // 4️⃣ Return result
    return {
        Status: Status,
        Confidence: Confidence,
        Type: Type,
        TypeConfidence: TypeConfidence
    };

}

function countWHZ(gender, weight, height) {
    // 1. First ensure height is a number
    const heightNum = typeof height === 'string' ? parseFloat(height) : Number(height);

    // 2. Check if we got a valid number
    if (isNaN(heightNum)) {
        console.error(`Invalid height value: ${height}`);
        return null;
    }

    // 3. Now format to 1 decimal place
    const heightKey = heightNum.toFixed(1);

    // 4. Safely access the LMS data
    const weightForLengthData = LMS[gender]?.weightForLength;

    if (!weightForLengthData || !weightForLengthData[heightKey]) {
        console.log(`No LMS data for ${gender} at ${heightKey} cm.`);
        return null;
    }

    const { L, M, S } = weightForLengthData[heightKey];

    // Calculate Z-score
    let Z = 0;
    if (L === 0) {
        Z = Math.log(weight / M) / S;
    } else {
        Z = (Math.pow(weight / M, L) - 1) / (L * S);
    }

    return Z;
}