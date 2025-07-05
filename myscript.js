import LMS from './lms.js';

// run once the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    adjustAgeLabel(ageLabelRadio, lineIndicator);
    nextQuestion.disabled = !form.checkValidity();
    maleIcon.style.color = 'white';
});

const ageLabelRadio = document.getElementById("age-label"); // This is probably a radio input
const lineIndicator = document.getElementById("indicator");
const slider = document.getElementById("slider");
const output = document.getElementById("output");

// adjustAgeLabel(ageLabelRadio, lineIndicator);

ageLabelRadio.addEventListener("change", function () {
    adjustAgeLabel(ageLabelRadio, lineIndicator);
    slider.value = slider.min
    output.value = slider.value;
});

function adjustAgeLabel(ageLabel, line) {
    let count;
    slider.min = 1;

    // Use .value if ageLabel is an <input> element
    if (ageLabel.value == "month") {
        count = 12;
        slider.max = 12;
    } else if (ageLabel.value == "years") {
        count = 5;
        slider.max = 5;
    } else {
        count = 0;
    }

    // Clear previous lines
    line.innerHTML = "";

    // Append <hr> elements
    for (let i = 0; i < count; i++) {
        const hr = document.createElement('hr');
        line.appendChild(hr);
    }
}

const maleIcon = document.getElementById('male-icon');
const femaleIcon = document.getElementById('female-icon');
const genderRadio = document.querySelectorAll('input[name="gender"]');

genderRadio.forEach(radio => {
    radio.addEventListener("click", function () {
        if (this.value === "male") {
            maleIcon.style.color = "white";
            femaleIcon.style.color = "#24A850"; // reset
        } else if (this.value === "female") {
            femaleIcon.style.color = "white";
            maleIcon.style.color = "#24A850"; // reset
        }
    });
});

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
    { id: '19', text: 'Breast Fed' },
];

const conflicts = {
    8: ['9', '11'],
    9: ['8'],
    11: ["12", "8"],
    12: ["11"],
    7: ["8"],
};
function setupConflictRules() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const selectedName = checkbox.name;
            const isChecked = checkbox.checked;

            // First, re-enable everything that’s not currently in conflict
            checkboxes.forEach(cb => {
                let stillInConflict = false;
                checkboxes.forEach(checkedBox => {
                    if (
                        checkedBox.checked &&
                        conflicts[checkedBox.name]?.includes(cb.name)
                    ) {
                        stillInConflict = true;
                    }
                });

                if (!stillInConflict) {
                    cb.disabled = false;
                }
            });

            // Disable direct conflicts of the one just selected
            if (isChecked && conflicts[selectedName]) {
                conflicts[selectedName].forEach(conflictName => {
                    const conflictCheckbox = document.querySelector(`input[name="${conflictName}"]`);
                    console.log(`Disabling conflict: ${conflictName}`);
                    if (conflictCheckbox) {
                        conflictCheckbox.checked = false;
                        conflictCheckbox.disabled = true;
                    }
                });
            }
        });
    });
}

createQuestionSection(headQuestion, 'hair-question');
createQuestionSection(skinQuestion, 'skin-question');
createQuestionSection(bodyQuestion, 'body-question');
createQuestionSection(behaviorQuestion, 'behavior-question');
createQuestionSection(healthQuestion, 'health-question');

setupConflictRules();

function createQuestionSection(questions, sectionId) {
    const section = document.getElementById(sectionId);
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-question';
        div.innerHTML = `
            <label class="choices">
                <input type="checkbox" name="${q.id}" value="yes">
                <span class="checkmark">${index + 1}. ${q.text}</span>
            </label>
        `;
        section.appendChild(div);
    });
}

const weightInput = document.querySelector('input[name="weight"]');
const weightUnit = document.querySelector('select[name="weight-unit"]');

weightUnit.addEventListener("change", function () {
    changeWeightUnit(weightInput, weightUnit)
});

restrictInput(weightInput, 2);


function changeWeightUnit(input, unit) {
    let value = parseFloat(input.value);

    // Do nothing if no valid value yet
    if (isNaN(value)) return;

    if (unit.value === "lbs") {
        // Convert kg → lbs
        input.value = (value * 2.20462).toFixed(1);
    } else if (unit.value === "kg") {
        // Convert lbs → kg
        input.value = (value / 2.20462).toFixed(1);
    }

}

const heightInput = document.querySelector('input[name="height"]');
const heightUnit = document.querySelector('select[name="height-unit"]');

restrictInput(heightInput, 3);

const muacInput = document.querySelector('input[name="muac"]');
const muacUnit = document.querySelector('select[name="muac-unit"]');

restrictInput(muacInput, 2);

function restrictInput(input, number) {
    input.addEventListener("input", function () {
        let value = input.value;

        // Restrict decimal places to 2
        if (value.includes('.')) {
            const [intPart, decimalPart] = value.split(".");
            input.value = intPart + "." + decimalPart.slice(0, 2);
        }
        // Restrict integer length
        if (!value.includes('.') && value.length > number) {
            input.value = value.slice(0, number);
        }
    });
}
heightUnit.addEventListener("input", function (event) {
    heightValue = parseFloat(event.target.value) || 0;
});

var heightValue;


const span = document.getElementById('height-display');

heightUnit.addEventListener("change", function () {
    changeHeightUnit(heightInput, heightUnit);
    validateForm(); // manually re-validate
    if (heightUnit.value === 'cm') {
        console.log('cm');
        span.textContent = '45 cm';
    } else if (heightUnit.value === 'inch') {
        console.log('inch');
        span.textContent = '17.8 inch';
    }
});

muacUnit.addEventListener("change", function () {
    changeHeightUnit(muacInput, muacUnit);
    validateForm(); // manually re-validate
});

// var height;

function changeHeightUnit(input, unit) {
    let value = parseFloat(input.value);

    if (isNaN(value)) return;

    if (unit.value === "inch") {
        input.value = (value / 2.54).toFixed(2);
    } else if (unit.value === "cm") {
        input.value = (value * 2.54).toFixed(1);
    }
}

let isHeightValid = false;

// Enable next button only when all inputs are answered
const form = document.querySelector("form");
form.addEventListener("input", validateForm);

function validateForm() {
    const isFormValid = form.checkValidity();
    heightValue = parseFloat(heightInput.value);

    if (!isNaN(heightValue)) {
        if (heightUnit.value === "cm") {
            isHeightValid = heightValue >= 45 && heightValue <= 110;
        } else if (heightUnit.value === "inch") {
            isHeightValid = heightValue >= 17.72 && heightValue <= 43.31;
        }
    } else {
        isHeightValid = false;
    }

    nextQuestion.disabled = !(isFormValid && isHeightValid);
}

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
    const age = form.querySelector('input[type="range"]').value;
    const ageUnit = form.querySelector('select[name="age"]').value;

    const gender = form.querySelector('input[name="gender"]:checked')?.value;

    const weight = form.querySelector('input[name="weight"]').value;
    const weightUnit = form.querySelector('select[name="weight-unit"]').value;

    var height = parseFloat(form.querySelector('input[name="height"]').value);
    const heightUnit = form.querySelector('select[name="height-unit"]').value;
    if (!isNaN(height)) {
        if (heightUnit === "inch") {
            height = height * 2.54
        }
        const remainder = height % 5;
        if (remainder > 0) {
            if (remainder < 2.5) {
                height = height - remainder; // Round down
            } else {
                height = height + (5 - remainder); // Round up
            }
        }
    }

    var muac = form.querySelector('input[name="muac"]').value;
    const muacUnit = form.querySelector('select[name="muac-unit"]').value;
    if (!isNaN(muac)) {
        if (muacUnit === "inch") {
            muac = muac * 2.54
        }
    }

    const questions = {
        headQuestion,
        skinQuestion,
        bodyQuestion,
        behaviorQuestion,
        healthQuestion
    };

    function getSymptomsFromForm(questionCategories) {
        return Object.values(questionCategories).flat().reduce((acc, q) => {
            const value = form.querySelector(`input[name="${q.id}"]:checked`)?.value;
            const key = q.text.toLowerCase().replace(/\s+/g, '');
            if (value === 'yes') {
                acc[key] = true;
            } else if (value === 'no') {
                acc[key] = false;
            } else {
                acc[key] = null; // optional: set to null if unanswered
            }
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

    // console.log(answers);
    // console.log(countWHZ(gender, weight, height));
    // console.log(result);

    window.location.href = "output.html";
});

// Diagnosis for symptoms
function diagnosis(x) {
    // 1️⃣ Determine Nutritional Status + Confidence
    let Status = "Uncertain";
    let Confidence = "Low";
    let Type = "None";
    let TypeConfidence = "N/A";
    let Note = "";
    let riskScore = 0;
    const WHZ = countWHZ(x.gender, x.weight, x.height);

    var Source = [];
    var SymptomSource = [];

    // ---------------------------
    // 2️⃣ Risk Scoring System
    // ---------------------------
    if (x.edema) riskScore += 3;                              // Rule 1
    if (x.muac < 11.0) riskScore += 3;                        // Rule 2
    if (WHZ < -3.0) riskScore += 3;                           // Rule 3
    if (x.wasting) riskScore += 2;                            // Rule 4
    if (x.diarrhea) riskScore += 1;                           // Rule 5
    if (x.infection) riskScore += 1;                          // Rule 6
    if (x.faceelderly || x.wrinkledskin) riskScore += 1;      // Rule 7
    if (x.hairsparse || x.haircolorchange) riskScore += 1;    // Rule 8

    // ---------------------------
    // 3️⃣ Nutritional Status Rules
    // ---------------------------
    if (x.symptoms.edema || x.muac < 11.0 || WHZ < -3.0) {   // Rule 9
        console.log(x.symptoms.edema)
        console.log(x.muac)
        console.log(WHZ)
        Status = "SAM";
        Confidence = "High";
        if (x.symptoms.edema) {
            Source.push("Have Edema");
        }
        if (x.muac < 11.0) {
            Source.push("MUAC < 11.0 cm");
        }
        if (WHZ < -3.0) {
            Source.push("WHZ < -3.0");
        }
    } else if (x.muac >= 11.0 && x.muac <= 11.2) {            // Rule 10
        Status = "SAM";
        Confidence = "Medium";
        Source.push("MUAC between 11.0 and 11.2 cm");
    } else if (x.muac > 11.2 && x.muac <= 11.4) {             // Rule 11
        Status = "SAM";
        Confidence = "Low";
        Source.push("MUAC between 11.2 and 11.4 cm");
    } else if (x.muac >= 11.5 && x.muac <= 12.5) {            // Rule 12
        Status = "MAM";
        Confidence = "High";
        Source.push("MUAC between 11.5 and 12.5 cm");
    } else if (WHZ >= -3.0 && WHZ <= -2.5) {                  // Rule 13
        Status = "MAM";
        Confidence = "Medium";
        Source.push("WHZ between -3.0 and -2.5");
    } else if (WHZ >= -2.5 && WHZ <= -2.0) {                  // Rule 14
        Status = "At Risk";
        Confidence = "Medium";
        Source.push("WHZ between -2.5 and -2.0");
    } else if (x.muac > 12.5 && WHZ > -2.0) {                 // Rule 15
        Status = "Normal";
        Confidence = "High";
        Source.push("MUAC > 12.5 cm");
        Source.push("WHZ > -2.0");
    }

    // ---------------------------
    // 4️⃣ Conflicting Input Check
    // ---------------------------
    let ConflictingInputs = false;

    if (x.muac < 11.0 && WHZ > -2.0) {                         // Rule 16
        ConflictingInputs = true;
        Note = "MUAC indicates SAM but WHZ is normal.";
        Source.push("MUAC < 11.0 cm");
        Source.push("WHZ > -2.0");
    }

    if (ConflictingInputs) {                                  // Rule 17
        Status = "Uncertain";
        Confidence = "Low";
        Type = "None";
        TypeConfidence = "N/A";
    }

    // ---------------------------
    // 5️⃣ Risk-based Override
    // ---------------------------
    if (!ConflictingInputs && riskScore >= 6 && Status !== "SAM") { // Rule 18
        Status = "SAM";
        Confidence = "Very High";
        Note = "Risk score high; upgraded to SAM.";
    }

    // ---------------------------
    // 6️⃣ Subtype Classification (if SAM)
    // ---------------------------
    if (Status === "SAM") {
        if (
            x.symptoms.hairsparse && x.symptoms.edema &&
            x.symptoms.wasting && x.symptoms.bloatedstomach &&
            x.symptoms.infection && x.symptoms.fattyliver &&
            x.symptoms.concavestomach && x.symptoms.wrinkledskin
        ) {
            Type = "Marasmic-Kwashiorkor";                   // Rule 21
            TypeConfidence = "High";
            SymptomSource = [
                "hairsparse", "edema", "wasting", "bloatedstomach", "infection",
                "fattyliver", "concavestomach", "wrinkledskin"
            ];
        } else if (
            x.symptoms.hairsparse && x.symptoms.haircolorchange &&
            x.symptoms.dermatosis && x.symptoms.edema &&
            x.symptoms.eyessightglazed && x.symptoms.fattyliver &&
            x.symptoms.infection && x.symptoms.apathetic &&
            x.symptoms.wasting && x.symptoms.cranky &&
            x.symptoms.anemic && x.symptoms.diarrhea
        ) {
            Type = "Kwashiorkor";                            // Rule 19
            TypeConfidence = "High";
            SymptomSource = [
                "hairsparse", "haircolorchange", "dermatosis", "edema",
                "eyessightglazed", "fattyliver", "infection", "apathetic",
                "wasting", "cranky", "anemic", "diarrhea"
            ];
        } else if (
            x.symptoms.wasting && x.symptoms.faceelderly &&
            x.symptoms.cranky && x.symptoms.wrinkledskin &&
            x.symptoms.mildwastingsigns && x.symptoms.concavestomach &&
            x.symptoms.infection && x.symptoms.diarrhea
        ) {
            Type = "Marasmus";                               // Rule 20
            TypeConfidence = "High";
            SymptomSource = [
                "wasting", "faceelderly", "cranky", "wrinkledskin",
                "mildwastingsigns", "concavestomach", "infection", "diarrhea"
            ];
        } else if (x.symptoms.edema && x.symptoms.hairsparse) {
            Type = "Kwashiorkor";                            // Rule 22
            TypeConfidence = "Medium";
            SymptomSource = ["edema", "hairsparse"];
        } else if (x.symptoms.wasting) {
            Type = "Marasmus";                               // Rule 23
            TypeConfidence = "Medium";
            SymptomSource = ["wasting"];
        } else {
            Type = "Unclear SAM Type";                       // Rule 24
            TypeConfidence = "Low";
        }
    }

    // ---------------------------
    // 7️⃣ Optional Environmental Rule (Bonus)
    // ---------------------------
    if (x.appetiteloss) {              // Rule 25
        Note += " Feeding problems observed.";
    }

    if (x.breastfed === false && x.age < 24) {                // Rule 28
        Note += " Not breastfed under 2 years old.";
        Status = Status === "Normal" ? "At Risk" : Status;    // Rule 29
    }

    // ---------------------------
    // 8️⃣ Final Fallback (if truly unclear)
    // ---------------------------
    if (Status === "Uncertain" && riskScore <= 2) {           // Rule 30
        Note += " Child appears stable but there is no clear indication of malnutrition. Monitoring is recommended.";
    }
    if (Status === "SAM") {
        Status = "Severe Acute Malnutrition (SAM)";
        Note = "Your child is showing signs of severe acute malnutrition. Immediate medical attention is strongly recommended.";
    }
    if (Status === "MAM") {
        Status = "Moderate Acute Malnutrition (MAM)";
        Note = "Your child is moderately malnourished. Nutritional support and close follow-up are important.";
    }
    if (Status === "Normal") {
        Status = "Healthy";
        Note = "Your child is healthy. Continue providing proper nutrition and care.";
    }

    // ---------------------------
    // 9️⃣ Return Result
    // ---------------------------
    return {
        Status: Status,
        Confidence: Confidence,
        Type: Type,
        TypeConfidence: TypeConfidence,
        Note: Note.trim(),
        RiskScore: riskScore,
        Source: Source,
        SymptomSource: SymptomSource,
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