const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.trim();
    if (query.length > 0) {
        fetchWordData(query);
    } else {
        document.getElementById('results').innerHTML = '';
    }
});

async function fetchWordData(word) {
    try {
        const response = await fetch(`${API_URL}${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayResults(data[0]);
    } catch (error) {
        document.getElementById('results').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    const word = data.word;
    const phonetic = data.phonetic;
    const phonetics = data.phonetics;
    const meanings = data.meanings;

    let html = `<div class="result-item">
        <h2>${word}</h2>
        <p class="phonetic">${phonetic}</p>`;

    if (phonetics.length > 0) {
        html += '<div class="phonetics">';
        phonetics.forEach(phonetic => {
            if (phonetic.audio) {
                html += `<audio class="audio" controls>
                    <source src="${phonetic.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>`;
            }
        });
        html += '</div>';
    }

    meanings.forEach(meaning => {
        html += `<div class="definition">
            <strong>${meaning.partOfSpeech}</strong>
            <ul>`;
        meaning.definitions.forEach(def => {
            html += `<li>${def.definition}`;
            if (def.example) {
                html += `<br><span class="example">Example: ${def.example}</span>`;
            }
            html += `</li>`;
        });
        html += '</ul></div>';
    });

    resultsContainer.innerHTML = html;
}
