function assLinkHandle(){
    {
        const assignmentLink = assignmentInput.value.trim();
    
        if (assignmentLink && currentClass) {
            // Add the new assignment to the class
            classes[currentClass].push(assignmentLink);
    
            // Display the new assignment in the list
                    // Create HTML string for the new assignment
                    const listItemHTML = `
                    <li>
                        <a href="${assignmentLink}" target="_blank">${assignmentLink}</a>
                    </li>
                `;
                
                // Insert the new assignment into the list
                assignmentList.insertAdjacentHTML('beforeend', listItemHTML);
        
                // Clear the input field
                assignmentInput.value = "";
        } else {
            alert("Please enter a valid assignment link.");
        }
    }
}

function clasInpHandle(){
    const className = classInput.value.trim();
    
    if (classes.hasOwnProperty(className)) {
        // Class exists
        currentClass = className;
        classTitle.textContent = `Assignments for ${currentClass}`;
        assignmentsSection.style.display = "block";

        // Clear the existing assignment list
        assignmentList.innerHTML = "";

        // Display assignments for the current class
        classes[currentClass].forEach((assignment) => {
            const li = document.createElement("li");
            li.textContent = assignment;
            assignmentList.appendChild(li);
        });

        // Clear input field
        // classInput.value = "";
        assignmentSec.style.display="block"
        

    } else {
        alert("Class not found! Please try again.");
    }
}


// Dummy list of classes and assignments
const classes = {
    "10A": ["https://assignment1.com", "https://assignment2.com"],
    "12A": ["https://assignment3.com"],
};

// Get HTML elements
const assignmentSec=document.getElementById("asinp")
const classInput = document.getElementById("class-name");
const classSubmitBtn = document.getElementById("class-submit-btn");
const assignmentInput = document.getElementById("assignment-link");
const submitBtn = document.getElementById("submit-btn");
const assignmentList = document.getElementById("assignment-items");
const classTitle = document.getElementById("class-title");
const assignmentsSection = document.getElementById("assignments-section");

// Variables to track current class
let currentClass = "";

// Event listener for checking the class name
classSubmitBtn.addEventListener("click",clasInpHandle );

// Event listener for submitting a new assignment
submitBtn.addEventListener("click", assLinkHandle);
assignmentInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (like form submission)
        submitBtn.click(); // Trigger the click event of submitBtn
    }
});

classInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (like form submission)
        classSubmitBtn.click(); // Trigger the click event of submitBtn
    }
});
