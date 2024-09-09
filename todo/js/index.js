// Array to store tasks
let tasks = [];

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const modal = document.getElementById('task-modal');

// Event Listeners
document.querySelector('.add-task-btn').addEventListener('click', () => {
    modal.style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-due-date').value;
    const taskTime = document.getElementById('task-due-time').value;

    // Create a task object with a dueDate as a Date object
    const task = {
        name: taskName,
        dueDate: new Date(`${taskDate}T${taskTime}`),  // Ensure dueDate is a Date object
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    modal.style.display = 'none';
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks.map(task => {
            return {
                ...task,
                dueDate: new Date(task.dueDate) // Convert dueDate back to Date object
            };
        });
    }
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = '';

    // Sort tasks by remaining time (nearest deadline first)
    tasks.sort((a, b) => a.dueDate - b.dueDate);

    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        
        // Task urgency color coding
        const timeRemaining = task.dueDate - new Date();
        if (timeRemaining < 3600000) taskCard.classList.add('urgent'); // 1 hour = 3600000 ms

        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');
        taskInfo.innerHTML = `<h3>${task.name}</h3><p>Due: ${task.dueDate.toLocaleString()}</p>`;

        const countdown = document.createElement('div');
        countdown.classList.add('task-countdown');
        countdown.textContent = getTimeRemaining(task.dueDate);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeTask(taskCard, index));

        // Append elements to the task card
        taskCard.appendChild(taskInfo);
        taskCard.appendChild(countdown);
        taskCard.appendChild(removeBtn);

        taskList.appendChild(taskCard);
    });
}

function getTimeRemaining(dueDate) {
    const timeRemaining = dueDate - new Date();
    const hours = Math.floor(timeRemaining / 3600000); // Convert ms to hours
    const minutes = Math.floor((timeRemaining % 3600000) / 60000); // Remaining minutes
    return `${hours}h ${minutes}m remaining`;
}

function removeTask(taskElement, index) {
    // Add removing class to trigger animation
    taskElement.classList.add('removing');

    // Wait for animation to complete before removing task
    setTimeout(() => {
        tasks.splice(index, 1); // Remove task from the array
        saveTasks();            // Update local storage
        displayTasks();          // Re-render the tasks
    }, 500); // Match with the CSS animation duration
}

// Initial load of tasks from local storage
loadTasks();
