const API_URL = 'https://script.google.com/macros/s/AKfycbzCuCuf4Vyn5lJ7QpJ5B-ghRLoKqRi0lCHks62y2rY2x2Rn3bk7AgrLcp9v9RwPoMbfJA/exec';

const checkboxFields = [
    'Sanskrit',
    'English Transliteration',
    'Bangla Transliteration',
    'English Translation',
    'Bangla Translation'
];

let appData = null;
let currentChapter = null;

async function loadData(){
    try{
        const response = await fetch(API_URL);
        const data = await response.json();
        appData = data;
        createCheckboxes();
        renderIndex();
    }
    catch(error){
        console.error(error);
        alert('Failed to load Google Sheet data');
    }
    finally{
        document.getElementById('loader').style.display = 'none';
    }
}

function createCheckboxes(){
    const container = document.getElementById('checkboxContainer');
    container.innerHTML = '';

    checkboxFields.forEach(field => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${field}" checked>
            <span>${field}</span>
        `;
        container.appendChild(label);
    });

    container.addEventListener('change', () => {
        if(currentChapter){
            renderChapter(currentChapter);
        }
    });
}

function getSelectedFields(){
    return [
        ...document.querySelectorAll('#checkboxContainer input:checked')
    ].map(el => el.value);
}

function renderIndex(){
    const container = document.getElementById('indexContainer');
    container.innerHTML = '';

    appData.index.forEach(item => {
        const card = document.createElement('div');
        card.className = 'index-item';

        let extraFields = '';
        Object.keys(item).forEach(key => {
            if(key !== 'Chapter' && item[key]){
                extraFields += `<div>${item[key]}</div>`;
            }
        });

        card.innerHTML = `
            <h3>${item['Chapter']}</h3>
            <div class="index-extra">${extraFields}</div>
        `;

        card.addEventListener('click', () => {
            renderChapter(item['Chapter']);
        });

        container.appendChild(card);
    });
}

function renderChapter(chapterName){
    currentChapter = chapterName;
    const chapter = appData.chapters.find(
        item => item.sheetName === chapterName
    );

    if(!chapter) return;

    document.getElementById('bookView').style.display = 'none';
    document.getElementById('chapterView').style.display = 'block';

    renderChapterHeader(chapterName);
    renderVerses(chapter);

    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

function renderChapterHeader(chapterName){
    const header = document.getElementById('chapterHeader');
    const chapterIndexData = appData.index.find(
        item => item['Chapter'] === chapterName
    );

    let metaHTML = '';
    if(chapterIndexData){
        Object.keys(chapterIndexData).forEach(key => {
            if(key !== 'Chapter' && chapterIndexData[key]){
                metaHTML += `<div>${chapterIndexData[key]}</div>`;
            }
        });
    }

    header.innerHTML = `
        <button class="back-btn" onclick="backToIndex()">
            ← Back to Index
        </button>
        <h2>${chapterName}</h2>
        <div class="chapter-meta">${metaHTML}</div>
    `;
}

function renderVerses(chapter){
    const selectedFields = getSelectedFields();
    const container = document.getElementById('versesContainer');
    container.innerHTML = '';

    chapter.verses.forEach(verse => {
        const card = document.createElement('div');
        card.className = 'verse-card';

        const fullVerse = verse['Verse'] || '';
        const verseOnly = fullVerse.includes('-') ? fullVerse.split('-')[1] : fullVerse;
        const formattedVerse = verseOnly.replaceAll('_', ', ');

        let html = `
            <div class="verse-number">
                Verse ${formattedVerse}
            </div>
        `;

        selectedFields.forEach(field => {
            if(verse[field]){
                let extraClass = '';

                if(field === 'Sanskrit'){
                    extraClass = 'sanskrit';
                }
                else if(field === 'English Transliteration'){
                    extraClass = 'english-transliteration';
                }
                else if(field === 'English Translation'){
                    extraClass = 'english-text';
                }
                else if(field === 'Bangla Transliteration'){
                    extraClass = 'bangla-transliteration';
                }
                else if(field === 'Bangla Translation'){
                    extraClass = 'bangla-text';
                }

                // FIXED: Placed variable directly inside tag borders to completely eliminate dynamic whitespace injection
                html += `
                    <div class="field">
                        <div class="field-title">${field}</div>
                        <div class="field-content ${extraClass}">${verse[field]}</div>
                    </div>
                `;
            }
        });

        card.innerHTML = html;
        container.appendChild(card);
    });
}

function backToIndex(){
    document.getElementById('chapterView').style.display = 'none';
    document.getElementById('bookView').style.display = 'block';
    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

loadData();