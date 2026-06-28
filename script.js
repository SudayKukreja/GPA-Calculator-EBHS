let classCounter = 0;

function calculateGPA() {
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

    if (isNaN(credits) || credits <= 0) return;

    const ebhsWeighted   = getGradeValue(classType, grade);
    const ebhsUnweighted = getGradeValue("academic", grade);

    total_ebhs_weighted   += ebhsWeighted   * credits;
    total_ebhs_unweighted += ebhsUnweighted * credits;

    const usWeighted   = getUSGradeValue(classType, grade);
    const usUnweighted = getUSGradeValue("academic", grade);

    total_us_weighted   += usWeighted   * credits;
    total_us_unweighted += usUnweighted * credits;

    total_credits += credits;
  });

  if (total_credits === 0) {
    alert("Please add at least one class with valid credits.");
    return;
  }

  const ebhsWeightedGPA   = total_ebhs_weighted   / total_credits;
  const ebhsUnweightedGPA = total_ebhs_unweighted / total_credits;
  const usWeightedGPA     = total_us_weighted      / total_credits;
  const usUnweightedGPA   = total_us_unweighted    / total_credits;

  document.getElementById("weighted-gpa").textContent   = "EBHS Weighted GPA: "   + ebhsWeightedGPA.toFixed(4);
  document.getElementById("unweighted-gpa").textContent = "EBHS Unweighted GPA: " + ebhsUnweightedGPA.toFixed(4);

  document.getElementById("ebhs-weighted").textContent   = "US Scale — Weighted GPA: "   + usWeightedGPA.toFixed(4);
  document.getElementById("ebhs-unweighted").textContent = "US Scale — Unweighted GPA: " + usUnweightedGPA.toFixed(4);
  document.getElementById("us-weighted").textContent   = "";
  document.getElementById("us-unweighted").textContent = "";

  document.getElementById("result").style.display = "block";
}

// EBHS-specific grade values (from the official handbook)
function getGradeValue(class_type, grade) {
  const grades = {
    "academic": {
      "A+": 4.30, "A": 4.00, "A-": 3.70,
      "B+": 3.30, "B": 3.00, "B-": 2.70,
      "C+": 2.30, "C": 2.00, "C-": 1.70,
      "D+": 1.30, "D": 1.00, "D-": 0.70,
      "F": 0.00
    },
    "accelerated": {
      // Academic values × 1.05 (5% boost per EBHS handbook)
      "A+": 4.515, "A": 4.200, "A-": 3.885,
      "B+": 3.465, "B": 3.150, "B-": 2.835,
      "C+": 2.415, "C": 2.100, "C-": 1.785,
      "D+": 1.365, "D": 1.050, "D-": 0.735,
      "F": 0.000
    },
    "honors": {
      // Academic values × 1.15 (15% boost per EBHS handbook)
      "A+": 4.945, "A": 4.600, "A-": 4.255,
      "B+": 3.795, "B": 3.450, "B-": 3.105,
      "C+": 2.645, "C": 2.300, "C-": 1.955,
      "D+": 1.495, "D": 1.150, "D-": 0.805,
      "F": 0.000
    },
    "ap": {
      // Academic values × 1.25 (25% boost per EBHS handbook)
      "A+": 5.375, "A": 5.000, "A-": 4.625,
      "B+": 4.125, "B": 3.750, "B-": 3.375,
      "C+": 2.875, "C": 2.500, "C-": 2.125,
      "D+": 1.625, "D": 1.250, "D-": 0.875,
      "F": 0.000
    }
  };
  return grades[class_type]?.[grade] ?? 0.0;
}

// Standard US weighted scale for comparison
function getUSGradeValue(class_type, grade) {
  const baseGrades = { "A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0 };
  const baseValue = baseGrades[grade[0]] ?? 0.0;
  let boost = 0;
  if (class_type === "accelerated") boost = 0.5;
  else if (class_type === "honors")      boost = 0.5;
  else if (class_type === "ap")          boost = 1.0;
  return baseValue + boost;
}

function updateClassCounter() {
  const classes = document.querySelectorAll(".class-box");
  document.getElementById("class-counter").textContent = `Number of classes: ${classes.length}`;
  classes.forEach((classDiv, index) => {
    classDiv.querySelector("h3").textContent = `Class ${index + 1}`;
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
  typeLabel.textContent = "Class Type";
  typeLabel.setAttribute("for", `class-type-${i}`);
  const typeSelect = document.createElement("select");
  typeSelect.id = `class-type-${i}`;
  typeSelect.required = true;
  [
    { value: "academic",     label: "Academic" },
    { value: "accelerated",  label: "Accelerated" },
    { value: "honors",       label: "Honors" },
    { value: "ap",           label: "AP" }
  ].forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    typeSelect.appendChild(opt);
  });
  classDiv.appendChild(typeLabel);
  classDiv.appendChild(typeSelect);

  // Grade
  const gradeLabel = document.createElement("label");
  gradeLabel.textContent = "Grade Received";
  gradeLabel.setAttribute("for", `grade-${i}`);
  const gradeSelect = document.createElement("select");
  gradeSelect.id = `grade-${i}`;
  gradeSelect.required = true;
  ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"].forEach(grade => {
    const opt = document.createElement("option");
    opt.value = grade;
    opt.textContent = grade;
    gradeSelect.appendChild(opt);
  });
  classDiv.appendChild(gradeLabel);
  classDiv.appendChild(gradeSelect);

  // Credits
  const creditLabel = document.createElement("label");
  creditLabel.textContent = "Credits";
  creditLabel.setAttribute("for", `credits-${i}`);
  const creditInput = document.createElement("input");
  creditInput.type = "number";
  creditInput.min = "0";
  creditInput.step = "0.25";
  creditInput.id = `credits-${i}`;
  creditInput.required = true;
  creditInput.placeholder = "e.g. 5";
  classDiv.appendChild(creditLabel);
  classDiv.appendChild(creditInput);

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    classDiv.remove();
    updateClassCounter();
  });
  classDiv.appendChild(removeBtn);

  classDetails.appendChild(classDiv);
  updateClassCounter();

  // Animate in
  requestAnimationFrame(() => classDiv.classList.add("visible"));
}

// Show/hide US comparison
document.getElementById("show-comparison").addEventListener("change", (e) => {
  const compDiv = document.getElementById("comparison");
  compDiv.style.display = e.target.checked ? "block" : "none";
});

// Add Class button
document.getElementById("add-class-container").innerHTML =
  `<button type="button" id="add-class-btn">+ Add Class</button>`;
document.getElementById("add-class-btn").addEventListener("click", addClass);

// Start with one class
addClass();