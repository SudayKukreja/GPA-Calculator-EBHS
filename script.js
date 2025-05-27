let classCounter = 0;

function calculateGPA() {
  const academic_grades = {
    "A+": 4.3, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0
  };

  let total_ebhs_weighted = 0;
  let total_ebhs_unweighted = 0;
  let total_us_weighted = 0;
  let total_us_unweighted = 0;
  let total_credits = 0;

  const classes = document.querySelectorAll(".class-box");
  classes.forEach(classDiv => {
    const id = classDiv.id.split("-")[2];
    const classType = document.getElementById(`class-type-${id}`).value;
    const grade = document.getElementById(`grade-${id}`).value;
    const credits = parseFloat(document.getElementById(`credits-${id}`).value);

    if (isNaN(credits)) return;

    const ebhsWeighted = getGradeValue(classType, grade);
    const ebhsUnweighted = getGradeValue("academic", grade);

    total_ebhs_weighted += ebhsWeighted * credits;
    total_ebhs_unweighted += ebhsUnweighted * credits;

    const usWeighted = getUSGradeValue(classType, grade);
    const usUnweighted = getUSGradeValue("academic", grade);

    total_us_weighted += usWeighted * credits;
    total_us_unweighted += usUnweighted * credits;

    total_credits += credits;
  });

  const ebhsWeightedGPA = total_ebhs_weighted / total_credits;
  const ebhsUnweightedGPA = total_ebhs_unweighted / total_credits;
  const usWeightedGPA = total_us_weighted / total_credits;
  const usUnweightedGPA = total_us_unweighted / total_credits;

  document.getElementById("weighted-gpa").textContent = "EBHS Weighted GPA: " + (ebhsWeightedGPA || 0).toFixed(4);
  document.getElementById("unweighted-gpa").textContent = "EBHS Unweighted GPA: " + (ebhsUnweightedGPA || 0).toFixed(4);
  document.getElementById("ebhs-weighted").textContent = "If this was the average US scale, Weighted GPA: " + (usWeightedGPA || 0).toFixed(4);
  document.getElementById("ebhs-unweighted").textContent = "If this was the average US scale, Unweighted GPA: " + (usUnweightedGPA || 0).toFixed(4);
  document.getElementById("us-weighted").textContent = "";
  document.getElementById("us-unweighted").textContent = "";
}

function getGradeValue(class_type, grade) {
  const grades = {
    "academic": {
      "A+": 4.3, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0
    },
    "honors": {
      "A+": 4.945, "A": 4.6, "A-": 4.255, "B+": 3.795, "B": 3.45, "B-": 3.105,
      "C+": 2.645, "C": 2.3, "C-": 1.955, "D+": 1.338, "D": 1.15, "D-": 0.805, "F": 0.0
    },
    "ap": {
      "A+": 5.375, "A": 5.0, "A-": 4.625, "B+": 4.125, "B": 3.75, "B-": 3.375,
      "C+": 2.875, "C": 2.5, "C-": 2.125, "D+": 1.625, "D": 1.25, "D-": 0.875, "F": 0.0
    }
  };
  return grades[class_type]?.[grade] ?? 0.0;
}

function getUSGradeValue(class_type, grade) {
  const baseGrades = { "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0 };
  const baseGradeLetter = grade[0];
  let baseValue = baseGrades[baseGradeLetter] ?? 0.0;
  let weightedBoost = 0;
  if (class_type === "honors") weightedBoost = 0.5;
  else if (class_type === "ap") weightedBoost = 1.0;
  return baseValue + weightedBoost;
}

function updateClassCounter() {
  const counterDisplay = document.getElementById("class-counter");
  const classes = document.querySelectorAll(".class-box");
  counterDisplay.textContent = `Number of classes: ${classes.length}`;
  classes.forEach((classDiv, index) => {
    const title = classDiv.querySelector("h3");
    title.textContent = `Class ${index + 1}`;
  });
}

function addClass() {
  classCounter++;
  const i = classCounter;
  const classDetails = document.getElementById("class-details");

  const classDiv = document.createElement("div");
  classDiv.classList.add("class-box");
  classDiv.id = `class-box-${i}`;

  const title = document.createElement("h3");
  title.textContent = `Class ${i}`;
  classDiv.appendChild(title);

  // Class Type
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Class Type (Academic, Honors, AP): ";
  typeLabel.setAttribute("for", `class-type-${i}`);
  const typeSelect = document.createElement("select");
  typeSelect.id = `class-type-${i}`;
  typeSelect.required = true;
  ["Academic", "Honors", "AP"].forEach(type => {
    const opt = document.createElement("option");
    opt.value = type.toLowerCase();
    opt.textContent = type;
    typeSelect.appendChild(opt);
  });
  classDiv.appendChild(typeLabel);
  classDiv.appendChild(typeSelect);

  // Grade
  const gradeLabel = document.createElement("label");
  gradeLabel.textContent = "Grade Received: ";
  gradeLabel.setAttribute("for", `grade-${i}`);
  const gradeSelect = document.createElement("select");
  gradeSelect.id = `grade-${i}`;
  gradeSelect.required = true;
  ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"].forEach(grade => {
    const opt = document.createElement("option");
    opt.value = grade;
    opt.textContent = grade;
    gradeSelect.appendChild(opt);
  });
  classDiv.appendChild(gradeLabel);
  classDiv.appendChild(gradeSelect);

  // Credits (fixed missing label)
  const creditLabel = document.createElement("label");
  creditLabel.textContent = "Credits: ";
  creditLabel.setAttribute("for", `credits-${i}`);
  const creditInput = document.createElement("input");
  creditInput.type = "number";
  creditInput.min = "0";
  creditInput.step = "0.25";
  creditInput.id = `credits-${i}`;
  creditInput.required = true;
  creditInput.value = "";
  classDiv.appendChild(creditLabel);
  classDiv.appendChild(creditInput);

  classDiv.appendChild(document.createElement("br"));

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    classDiv.remove();
    updateClassCounter();
  });
  classDiv.appendChild(removeBtn);

  classDetails.appendChild(classDiv);
  updateClassCounter();
}

document.getElementById("add-class-container").innerHTML = `<button type="button" id="add-class-btn">Add Class</button>`;
document.getElementById("add-class-btn").addEventListener("click", addClass);

document.getElementById("show-comparison").addEventListener("change", (e) => {
  const compDiv = document.getElementById("comparison");
  if (e.target.checked) {
    compDiv.style.display = "block";
  } else {
    compDiv.style.display = "none";
  }
});


addClass();
