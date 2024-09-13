async function fetchClassAssignments() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz6vkgVraXsAPBYvOYz-JvuHKSPeoeUlM5I4G3fX-hHPRz8tbesJtfsnrTEoSH5x_8C3Q/exec'); // Replace with your actual API endpoint
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        // Assuming the API returns an object where keys are class names and values are assignment links
        return data;
    } catch (error) {
        console.error("Error fetching class assignments:", error);
        return {}; // Return an empty object in case of error
    }
}

function addAss(link){
    const listItemHTML = `
    <li>
        <a href="${link}" target="_blank">${link}</a>
    </li>
`;

// Insert the new assignment into the list
assignmentList.insertAdjacentHTML('afterbegin', listItemHTML);

// Clear the input field
assignmentInput.value = "";
}

// Function to handle new assignment link submission
async function assLinkHandle() {
    // Get the assignment link entered by the user
    const assignmentLink = assignmentInput.value.trim();
    addAss(assignmentLink)

    // Ensure there is an assignment link and class name
    if (assignmentLink) {
        // Prepare the data to send in the POST request
        const data = {
            className: currentClass,          // Specify the class name (e.g., '12A')
            assignmentLink: assignmentLink // Use the inputted assignment link
        };

        // Correct the Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwu_8LhqGJwCWelQbcMR1qkSTXMz95-iS4bwGVro9tendRlbWbJYpWLeEHrTWGbv0N5ag/exec';

        // Send a POST request to the Google Apps Script Web App
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Disable CORS (no response will be available)
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Send the data as JSON
        })
        .then(response => {
            console.log('Data sent, but response not available due to no-cors mode.');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("Please enter a valid assignment link.");
    }
}


async function Update() {
    console.log(1)
    await fetchClassAssignments().then(fetchedData => {
        classes = fetchedData; // Update the classes object with data from API
        console.log("Classes object:", classes); // Log the classes object to confirm it's properly set
      
        // You can place other synchronous actions here that depend on `classes`
      });
    
    
}




async function clasInpHandle(){
    const className = classInput.value.trim();
    await Update()
    console.log(2)
  
  

    
    if (classes.hasOwnProperty(className)) {
        // Class exists
        currentClass = className;
        classTitle.textContent = `Assignments for ${currentClass}`;
        assignmentsSection.style.display = "block";

        // Clear the existing assignment list
        assignmentList.innerHTML = "";

        // Display assignments for the current class
        classes[currentClass].forEach((assignment) => {
            addAss(assignment)
        });

        // Clear input field
        // classInput.value = "";
        assignmentSec.style.display="block"
        

    } else {
        alert("Class not found! Please try again.");
    }
}


// Initialize class data from API
let classes = {};

fetchClassAssignments().then(fetchedData => {
    classes = fetchedData; // Update the classes object with data from API
    console.log("Classes object:", classes); // Log the classes object to confirm it's properly set
});


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
