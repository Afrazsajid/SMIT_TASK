document.addEventListener('DOMContentLoaded', () => {
    const categoriesList = document.getElementById('categories-list');
    const flashcardsList = document.getElementById('flashcards-list');
    const overlay = document.getElementById('overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');
    const closeModalBtn = document.getElementById('close-modal-btn');
    let currentCategory = '';

    // Load data from local storage
    function loadData() {
        const storedCategories = localStorage.getItem('categories');
        const storedFlashcards = localStorage.getItem('flashcards');
        return {
            categories: storedCategories ? JSON.parse(storedCategories) : [],
            flashcards: storedFlashcards ? JSON.parse(storedFlashcards) : []
        };
    }

    // Save data to local storage
    function saveData(categories, flashcards) {
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }

    // Render categories
    function renderCategories(categories) {
        categoriesList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.addEventListener('click', () => {
                currentCategory = category;
                renderFlashcards();
            });
            categoriesList.appendChild(li);
        });
    }

    // Render flashcards
    function renderFlashcards() {
        const { flashcards } = loadData();
        flashcardsList.innerHTML = '';
        flashcards
            .filter(card => card.category === currentCategory)
            .forEach(card => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${card.term}</strong>: ${card.definition}`;
                flashcardsList.appendChild(li);
            });
    }

    // Open modal
    function openModal(title) {
        modalTitle.textContent = title;
        overlay.style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        overlay.style.display = 'none';
    }

    // Handle adding category
    document.getElementById('add-category-btn').addEventListener('click', () => {
        openModal('Add New Category');
        modalForm.onsubmit = (e) => {
            e.preventDefault();
            const { categories, flashcards } = loadData();
            const name = e.target.name.value;
            categories.push(name);
            saveData(categories, flashcards);
            renderCategories(categories);
            closeModal();
        };
    });

    // Handle adding flashcard
    document.getElementById('add-flashcard-btn').addEventListener('click', () => {
        if (currentCategory === '') {
            alert('Please select a category first.');
            return;
        }
        openModal('Add New Flashcard');
        modalForm.onsubmit = (e) => {
            e.preventDefault();
            const { categories, flashcards } = loadData();
            const term = e.target.name.value;
            const definition = e.target.description.value;
            flashcards.push({ category: currentCategory, term, definition });
            saveData(categories, flashcards);
            renderFlashcards();
            closeModal();
        };
    });

    closeModalBtn.addEventListener('click', closeModal);

    // Initial render
    const { categories } = loadData();
    renderCategories(categories);
});
