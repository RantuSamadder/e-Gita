const API_URL = 'https://script.google.com/macros/s/AKfycbzCWcQgCbcKQMlMBC85nLYBN7Vskwsd0CeAd5H1jqvXBmGzPOKMdgebf_AlYwiz56hK/exec';

let appData = null;
let currentChapter = null; // Internal Bengali sheet name indicator
let currentLang = 'bn'; // 'bn' or 'en'
let viewMode = 'default'; // 'default' | 'advanced' | 'dual'

// UI Texts for Translation
const UI = {
    bn: {
        loaderText: "শ্রীমদ্ভগবদ্গীতা যথাযথ",
        heroTitle: "শ্রীমদ্ভগবদ্গীতা যথাযথ",
        heroSubtitle: "হরে কৃষ্ণ হরে কৃষ্ণ কৃষ্ণ কৃষ্ণ হরে হরে <br> হরে রাম হরে রাম রাম রাম হরে হরে",
        indexHeader: "সূচীপত্র",
        jumpHeaderMain: "সরাসরি শ্লোকে যান",
        optChap: "অধ্যায় নির্বাচন করুন",
        optVerse: "শ্লোক নির্বাচন করুন",
        btnGo: "যান →",
        btnGoVerse: "শ্লোকে যান",
        readingLayout: "পাঠ বিন্যাস",
        viewModeDefault: "সাধারণ",
        viewModeAdvanced: "বিস্তারিত",
        viewModeDual: "দ্বৈত ভাষা",
        backBtn: "← সূচীপত্রে ফিরে যান",
        versePrefix: "শ্লোক",
        prevBtnText: "← পূর্ববর্তী",
        nextBtnText: "পরবর্তী",
        alertBoth: "দয়া করে অধ্যায় ও শ্লোক উভয়ই সিলেক্ট করুন।",
        alertVerse: "দয়া করে শ্লোক সিলেক্ট করুন।"
    },
    en: {
        loaderText: "Śrīmad Bhagavad Gītā",
        heroTitle: "Śrīmad Bhagavad Gītā As It Is",
        heroSubtitle: "Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare <br> Hare Rāma Hare Rāma Rāma Rāma Hare Hare",
        indexHeader: "Index",
        jumpHeaderMain: "Jump Directly to Verse",
        optChap: "Select Chapter",
        optVerse: "Select Verse",
        btnGo: "Go →",
        btnGoVerse: "Go to Verse",
        readingLayout: "Reading Layout",
        viewModeDefault: "Default View",
        viewModeAdvanced: "Advanced View",
        viewModeDual: "Dual language View",
        backBtn: "← Back to Index",
        versePrefix: "Verse",
        prevBtnText: "← Previous",
        nextBtnText: "Next",
        alertBoth: "Please select both chapter and verse.",
        alertVerse: "Please select a verse."
    }
};

// Allowed fields for Checkboxes and Rendering per Language
const LANG_FIELDS = {
    bn: ['শ্লোক', 'সংষ্কৃতম্', 'উচ্চারণ', 'শব্দার্থ', 'গীতার গান', 'অনুবাদ', 'তাৎপর্য', 'ভূমিকা', 'মুখবন্ধ'],
    en: ['Verse', 'সংষ্কৃতম্', 'Transliteration', 'Synonyms', 'Translation', 'Purport', 'Introduction', 'Preface']
};

// Fixed fields shown in "সাধারণ / Default View" (no checkboxes)
const DEFAULT_VIEW_FIELDS = {
    bn: ['উচ্চারণ', 'অনুবাদ'],
    en: ['Transliteration', 'Translation']
};

// Combined (Bengali + English) field groups for "দ্বৈত ভাষা / Dual language View".
// 'গীতার গান' is intentionally excluded here, as it has no English counterpart.
const DUAL_FIELD_GROUPS = [
    { id: 'সংষ্কৃতম্', bnKey: 'সংষ্কৃতম্', enKey: 'সংষ্কৃতম্', shared: true, labelBn: 'সংষ্কৃতম্', labelEn: 'Sanskrit' },
    { id: 'উচ্চারণ', bnKey: 'উচ্চারণ', enKey: 'Transliteration', labelBn: 'উচ্চারণ', labelEn: 'Transliteration' },
    { id: 'শব্দার্থ', bnKey: 'শব্দার্থ', enKey: 'Synonyms', labelBn: 'শব্দার্থ', labelEn: 'Synonyms' },
    { id: 'অনুবাদ', bnKey: 'অনুবাদ', enKey: 'Translation', labelBn: 'অনুবাদ', labelEn: 'Translation' },
    { id: 'তাৎপর্য', bnKey: 'তাৎপর্য', enKey: 'Purport', labelBn: 'তাৎপর্য', labelEn: 'Purport' }
];

async function loadData(){
    try{
        const response = await fetch(API_URL);
        const data = await response.json();
        appData = data;
        
        applyLanguageUI();
        renderIndex();
        initMainJumpFilter(); 
    }
    catch(error){
        console.error(error);
        alert('Failed to load Google Sheet data');
    }
    finally{
        document.getElementById('loader').style.display = 'none';
    }
}

// Handle Language Switch
function toggleLanguage() {
    const selector = document.getElementById('langSelect');
    currentLang = selector.value;
    
    // Toggle CSS Body Class for Fonts
    if(currentLang === 'en') {
        document.body.classList.add('lang-en');
    } else {
        document.body.classList.remove('lang-en');
    }

    applyLanguageUI();

    // Re-render UI Components based on current view
    if (document.getElementById('bookView').style.display !== 'none') {
        renderIndex();
        initMainJumpFilter();
    } else if (currentChapter) {
        renderChapter(currentChapter, true);
    }
}

function applyLanguageUI() {
    const text = UI[currentLang];
    document.getElementById('loaderText').innerHTML = text.loaderText;
    document.getElementById('heroTitle').innerHTML = text.heroTitle;
    document.getElementById('heroSubtitle').innerHTML = text.heroSubtitle;
    document.getElementById('indexHeader').innerText = text.indexHeader;
    document.getElementById('jumpHeaderMain').innerText = text.jumpHeaderMain;
    document.getElementById('btnGoMain').innerText = text.btnGo;
    document.getElementById('btnGoChap').innerText = text.btnGoVerse;

    const defaultTab = document.querySelector('.view-mode-btn[data-mode="default"]');
    const advancedTab = document.querySelector('.view-mode-btn[data-mode="advanced"]');
    const dualTab = document.querySelector('.view-mode-btn[data-mode="dual"]');
    if (defaultTab) defaultTab.textContent = text.viewModeDefault;
    if (advancedTab) advancedTab.textContent = text.viewModeAdvanced;
    if (dualTab) dualTab.textContent = text.viewModeDual;
}

// হোমপেইজের অধ্যায় ড্রপডাউন
function initMainJumpFilter() {
    const mainChapSelect = document.getElementById('mainChapterSelect');
    mainChapSelect.innerHTML = `<option value="">${UI[currentLang].optChap}</option>`;
    
    // Reset Verse select
    const mainVerseSelect = document.getElementById('mainVerseSelect');
    mainVerseSelect.innerHTML = `<option value="">${UI[currentLang].optVerse}</option>`;
    mainVerseSelect.disabled = true;

    const chapKey = currentLang === 'en' ? 'Chapter(En)' : 'Chapter';

    appData.সূচীপত্র.forEach(item => {
        if (item['Chapter'] !== 'ভূমিকা' && item['Chapter'] !== 'মুখবন্ধ') {
            const option = document.createElement('option');
            option.value = item['Chapter']; // Value always strict to Bengali SheetName
            option.textContent = item[chapKey] || item['Chapter']; // Display text depends on Lang
            mainChapSelect.appendChild(option);
        }
    });
}

function populateVerses(type) {
    const chapName = type === 'main' ? document.getElementById('mainChapterSelect').value : currentChapter;
    const verseSelect = document.getElementById(type === 'main' ? 'mainVerseSelect' : 'chapVerseSelect');
    
    if (!chapName) {
        verseSelect.innerHTML = `<option value="">${UI[currentLang].optVerse}</option>`;
        if(type === 'main') verseSelect.disabled = true;
        return;
    }

    const chapter = appData.chapters.find(item => item.sheetName === chapName);
    verseSelect.innerHTML = `<option value="">${UI[currentLang].optVerse}</option>`;
    
    if (chapter && chapter.verses) {
        chapter.verses.forEach(v => {
            // পরিবর্তন: ভাষা অনুযায়ী সঠিক কলাম (Key) নির্বাচন
            const verseKey = currentLang === 'en' ? 'Verse' : 'শ্লোক';
            const fallbackKey = currentLang === 'en' ? 'শ্লোক' : 'Verse';
            const fullVerse = v[verseKey] || v[fallbackKey] || '';
            if(!fullVerse) return;

            const verseOnly = fullVerse.includes('-') ? fullVerse.split('-')[1] : fullVerse;
            const formattedVerse = verseOnly.replaceAll('_', ', ');
            
            const option = document.createElement('option');
            option.value = fullVerse; 
            option.textContent = `${UI[currentLang].versePrefix} ${formattedVerse}`;
            verseSelect.appendChild(option);
        });
        if(type === 'main') verseSelect.disabled = false;
    }
}

function jumpToVerse(type) {
    let chapName, verseValue;

    if (type === 'main') {
        chapName = document.getElementById('mainChapterSelect').value;
        verseValue = document.getElementById('mainVerseSelect').value;
        if (!chapName || !verseValue) return alert(UI[currentLang].alertBoth);
        
        renderChapter(chapName, true); 
    } else {
        chapName = currentChapter;
        verseValue = document.getElementById('chapVerseSelect').value;
        if (!verseValue) return alert(UI[currentLang].alertVerse);
    }

    setTimeout(() => {
        const targetCard = document.getElementById(`verse-${verseValue}`);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetCard.style.background = '#ead8b1';
            setTimeout(() => { targetCard.style.background = '#fdf6e3'; }, 1500);
        }
    }, 500);
}

// চেকবক্স জেনারেট (ভাষা অনুযায়ী ফিল্টার করা)
function createCheckboxesForChapter(chapter){
    const container = document.getElementById('checkboxContainer');
    container.innerHTML = '';

    if (!chapter.verses || chapter.verses.length === 0) return;

    const firstVerse = chapter.verses[0];
    const allowedKeys = LANG_FIELDS[currentLang];
    
    // Find keys that exist in sheet AND match our current language allowed fields (exclude verse IDs)
    const fields = Object.keys(firstVerse).filter(key => 
        key !== 'শ্লোক' && key !== 'Verse' && allowedKeys.includes(key)
    );

    fields.forEach(field => {
        const label = document.createElement('label');
        
        // পরিবর্তন: পাঠ বিন্যাসের চেকবক্স লেবেলে ইংরেজি মোডে 'সংষ্কৃতম্' এর বদলে 'Sanskrit' দেখানোর জন্য
        const displayCheckboxLabel = (currentLang === 'en' && field === 'সংষ্কৃতম্') ? 'Sanskrit' : field;
        
        label.innerHTML = `
            <input type="checkbox" value="${field}" checked>
            <span>${displayCheckboxLabel}</span>
        `;
        container.appendChild(label);
    });
}

function getSelectedFields(){
    return [...document.querySelectorAll('#checkboxContainer input:checked')].map(el => el.value);
}

// চেকবক্স জেনারেট - দ্বৈত ভাষা (Dual language) মোডের জন্য কম্বাইন করা অপশন
function createDualCheckboxesForChapter(chapter){
    const container = document.getElementById('checkboxContainer');
    container.innerHTML = '';

    if (!chapter.verses || chapter.verses.length === 0) return;

    const firstVerse = chapter.verses[0];

    DUAL_FIELD_GROUPS.forEach(group => {
        const hasField = group.shared
            ? !!firstVerse[group.bnKey]
            : !!(firstVerse[group.bnKey] || firstVerse[group.enKey]);
        if (!hasField) return;

        const label = document.createElement('label');
        const displayLabel = currentLang === 'en' ? group.labelEn : group.labelBn;

        label.innerHTML = `
            <input type="checkbox" value="${group.id}" checked>
            <span>${displayLabel}</span>
        `;
        container.appendChild(label);
    });
}

// বর্তমান ভিউ মোড (সাধারণ/বিস্তারিত/দ্বৈত ভাষা) অনুযায়ী নিয়ন্ত্রণ (checkbox) অংশ তৈরি
function buildControlsForChapter(chapter){
    if (viewMode === 'advanced') {
        createCheckboxesForChapter(chapter);
    } else if (viewMode === 'dual') {
        createDualCheckboxesForChapter(chapter);
    } else {
        document.getElementById('checkboxContainer').innerHTML = '';
    }
    updateViewModeUI();
}

// ভিউ মোড ট্যাব বাটনের সক্রিয় অবস্থা এবং চেকবক্স গ্রিডের দৃশ্যমানতা আপডেট
function updateViewModeUI(){
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === viewMode);
    });

    const checkboxContainer = document.getElementById('checkboxContainer');
    if (checkboxContainer) {
        checkboxContainer.style.display = (viewMode === 'default') ? 'none' : '';
    }
}

// ভিউ মোড পরিবর্তন হ্যান্ডলার (সাধারণ / বিস্তারিত / দ্বৈত ভাষা)
function setViewMode(mode){
    if (viewMode === mode) return;
    viewMode = mode;

    if (!currentChapter || currentChapter === 'ভূমিকা' || currentChapter === 'মুখবন্ধ') {
        updateViewModeUI();
        return;
    }

    const chapter = appData.chapters.find(item => item.sheetName === currentChapter);
    if (!chapter) return;

    buildControlsForChapter(chapter);

    const scrollY = window.scrollY;
    renderVerses(chapter);
    window.scrollTo(0, scrollY);
}

// সূচীপত্র রেন্ডারিং (আপডেট করা হয়েছে)
function renderIndex(){
    const container = document.getElementById('indexContainer');
    container.innerHTML = '';

    const chapKey = currentLang === 'en' ? 'Chapter(En)' : 'Chapter';
    const nameKey = currentLang === 'en' ? 'Name(En)' : 'Name';

    appData.সূচীপত্র.forEach(item => {
        const card = document.createElement('div');
        card.className = 'index-item';

        const displayChap = item[chapKey] || item['Chapter'] || '';
        const displayName = item[nameKey] || '';

        let titleText = '';

        if (item['Chapter'] === 'ভূমিকা' || item['Chapter'] === 'মুখবন্ধ') {
            titleText = displayChap;
        } else if (displayChap && displayName) {
            titleText = `${displayChap} : ${displayName}`;
        } else {
            titleText = displayChap;
        }

        card.innerHTML = `<h3>${titleText}</h3>`;

        card.addEventListener('click', () => {
            renderChapter(item['Chapter'], true); // Always pass the internal base Chapter name
        });

        container.appendChild(card);
    });
}

function renderChapter(chapterName, isFirstLoad = false){
    currentChapter = chapterName;
    const chapter = appData.chapters.find(item => item.sheetName === chapterName);
    if(!chapter) return;

    document.getElementById('bookView').style.display = 'none';
    document.getElementById('chapterView').style.display = 'block';

    const checkboxControls = document.getElementById('checkboxControls');
    const chapterJumpControls = document.getElementById('chapJumpContainer');

    if (chapterName === 'ভূমিকা' || chapterName === 'মুখবন্ধ') {
        if (checkboxControls) checkboxControls.style.display = 'none';
        if (chapterJumpControls) chapterJumpControls.style.display = 'none';
    } else {
        if (checkboxControls) checkboxControls.style.display = 'block';
        if (chapterJumpControls) chapterJumpControls.style.display = 'block';
    }

    if (isFirstLoad && chapterName !== 'ভূমিকা' && chapterName !== 'মুখবন্ধ') {
        buildControlsForChapter(chapter);
        
        const container = document.getElementById('checkboxContainer');
        container.onchange = (e) => {
            e.stopPropagation();
            const scrollY = window.scrollY;
            if(currentChapter){
                requestAnimationFrame(() => {
                    renderVerses(chapter); 
                    window.scrollTo(0, scrollY);
                });
            }
        };
    }

    renderChapterHeader(chapterName);
    renderVerses(chapter);
    renderChapterNavigation(chapterName);

    // Populate inner chapter select
    const chapVerseSelect = document.getElementById('chapVerseSelect');
    if (chapVerseSelect && chapterName !== 'ভূমিকা' && chapterName !== 'মুখবন্ধ') {
        populateVerses('chap');
    }

    if (document.activeElement.tagName !== 'BUTTON') {
        window.scrollTo({ top:0, behavior:'smooth' });
    }
}

function renderChapterHeader(chapterName){
    const header = document.getElementById('chapterHeader');
    const chapterIndexData = appData.সূচীপত্র.find(item => item['Chapter'] === chapterName);

    const chapKey = currentLang === 'en' ? 'Chapter(En)' : 'Chapter';
    const descKey = currentLang === 'en' ? 'Details(En)' : 'Details';

    const displayTitle = chapterIndexData ? (chapterIndexData[chapKey] || chapterName) : chapterName;
    const displayDesc = chapterIndexData ? (chapterIndexData[descKey] || '') : '';

    header.innerHTML = `
        <button class="back-btn" onclick="backToIndex()">
            ${UI[currentLang].backBtn}
        </button>
        <h2>${displayTitle}</h2>
        ${displayDesc ? `<div class="chapter-meta">${displayDesc}</div>` : ''}
    `;
}

function renderVerses(chapter){
    const container = document.getElementById('versesContainer');
    container.innerHTML = '';

    // দ্বৈত ভাষা (Dual language) মোডের জন্য আলাদা রেন্ডারিং (পাশাপাশি বাংলা ও ইংরেজি)
    if (currentChapter !== 'ভূমিকা' && currentChapter !== 'মুখবন্ধ' && viewMode === 'dual') {
        renderVersesDual(chapter, container);
        return;
    }

    let selectedFields = [];
    if (currentChapter === 'ভূমিকা' || currentChapter === 'মুখবন্ধ') {
        const specialKey = currentLang === 'en' ? (currentChapter === 'ভূমিকা' ? 'Introduction' : 'Preface') : (currentChapter === 'ভূমিকা' ? 'ভূমিকা' : 'মুখবন্ধ');
        selectedFields = [specialKey];
    } else if (viewMode === 'default') {
        selectedFields = currentLang === 'en' ? DEFAULT_VIEW_FIELDS.en : DEFAULT_VIEW_FIELDS.bn;
    } else {
        selectedFields = getSelectedFields();
    }

    chapter.verses.forEach((verse, index) => {
        const card = document.createElement('div');
        
        if (currentChapter === 'ভূমিকা' || currentChapter === 'মুখবন্ধ') {
            card.className = 'verse-card special-page';
        } else {
            card.className = 'verse-card';
        }
        
        // পরিবর্তন: ভাষা অনুযায়ী কার্ড আইডি এবং শ্লোক নম্বর নির্ধারণ যেন ইংরেজিতে ইংরেজি সংখ্যা (01) আসে
        const verseKey = currentLang === 'en' ? 'Verse' : 'শ্লোক';
        const fallbackKey = currentLang === 'en' ? 'শ্লোক' : 'Verse';
        const fullVerse = verse[verseKey] || verse[fallbackKey] || `idx-${index}`;
        card.id = `verse-${fullVerse}`; 

        let html = '';
        if (currentChapter !== 'ভূমিকা' && currentChapter !== 'মুখবন্ধ' && (verse['শ্লোক'] || verse['Verse'])) {
            const verseOnly = fullVerse.includes('-') ? fullVerse.split('-')[1] : fullVerse;
            const formattedVerse = verseOnly.replaceAll('_', ', ');
            html = `<div class="verse-number">${UI[currentLang].versePrefix} ${formattedVerse}</div>`;
        }

        selectedFields.forEach(field => {
            if(verse[field]){
                let extraClass = '';
                let showTitle = true; 
                let content = verse[field];

                // পরিবর্তন: শ্লোক কার্ডের ভেতরে কোনো মোডেই (বাংলা/ইংরেজি) 'সংষ্কৃতম্' এর জন্য হেডিং টাইটেল দেখাবে না
                if(field === 'সংষ্কৃতম্'){ extraClass = 'sanskrit'; showTitle = false; }
                else if(field === 'Transliteration' || field === 'উচ্চারণ'){ extraClass = 'bangla-transliteration'; showTitle = false; }
                else if(field === 'Translation' || field === 'অনুবাদ'){ extraClass = 'bangla-text'; }
                else if(field === 'শব্দার্থ' || field === 'Synonyms'){ 
                    extraClass = 'word-meanings'; 
                    
                    // ফিল্ড অনুযায়ী বিভাজক (Separator) নির্ধারণ
                    const separator = field === 'শব্দার্থ' ? '-' : '—';
                    
                    content = content.split(';').map(part => {
                        if (part.includes(separator)) {
                            const idx = part.indexOf(separator);
                            return `<strong>${part.substring(0, idx)}</strong>${part.substring(idx)}`;
                        }
                        return part;
                    }).join(';');
                }
                else if(field.includes('গীতার') && field.includes('গান')){ extraClass = 'gitar-gaan-text'; }
                else if(field === 'তাৎপর্য' || field === 'Purport'){ extraClass = 'purport-text'; }
                else { extraClass = 'dynamic-' + field.toLowerCase().replace(/[^a-z0-9]/g, '-'); }

                if (currentChapter === 'ভূমিকা' || currentChapter === 'মুখবন্ধ') { showTitle = false; }

                html += `
                    <div class="field">
                        ${showTitle ? `<div class="field-title">${field}</div>` : ''}
                        <div class="field-content ${extraClass}">${content}</div>
                    </div>
                `;
            }
        });

        card.innerHTML = html;
        container.appendChild(card);
    });
}

// দ্বৈত ভাষা (Dual language) মোডের রেন্ডারিং: বাংলা ও ইংরেজি পাশাপাশি
function renderVersesDual(chapter, container){
    const selectedGroupIds = getSelectedFields();
    const selectedGroups = DUAL_FIELD_GROUPS.filter(g => selectedGroupIds.includes(g.id));

    const formatSynonyms = (content, separator) => content.split(';').map(part => {
        if (part.includes(separator)) {
            const idx = part.indexOf(separator);
            return `<strong>${part.substring(0, idx)}</strong>${part.substring(idx)}`;
        }
        return part;
    }).join(';');

    chapter.verses.forEach((verse, index) => {
        const card = document.createElement('div');
        card.className = 'verse-card dual-verse-card';

        // পরিবর্তন: ভাষা অনুযায়ী সঠিক কলাম থেকে শ্লোক নম্বর নেওয়া হচ্ছে, যেন ইংরেজি মোডে ইংরেজি সংখ্যা (01) দেখায়
        const verseKey = currentLang === 'en' ? 'Verse' : 'শ্লোক';
        const fallbackKey = currentLang === 'en' ? 'শ্লোক' : 'Verse';
        const fullVerse = verse[verseKey] || verse[fallbackKey] || `idx-${index}`;
        card.id = `verse-${fullVerse}`;

        let html = '';
        if (verse['শ্লোক'] || verse['Verse']) {
            const verseOnly = fullVerse.includes('-') ? fullVerse.split('-')[1] : fullVerse;
            const formattedVerse = verseOnly.replaceAll('_', ', ');
            html = `<div class="verse-number">${UI[currentLang].versePrefix} ${formattedVerse}</div>`;
        }

        selectedGroups.forEach(group => {
            if (group.shared) {
                const content = verse[group.bnKey];
                if (!content) return;
                html += `
                    <div class="field">
                        <div class="field-content sanskrit">${content}</div>
                    </div>
                `;
                return;
            }

            const bnContent = verse[group.bnKey];
            const enContent = verse[group.enKey];
            if (!bnContent && !enContent) return;

            let extraClass = '';
            // পরিবর্তন: 'উচ্চারণ / Transliteration' এর জন্য কোনো টাইটেল দেখাবে না (একক ভাষার ভিউয়ের মতোই)
            const showTitle = group.id !== 'উচ্চারণ';
            if (group.id === 'উচ্চারণ') extraClass = 'bangla-transliteration';
            else if (group.id === 'অনুবাদ') extraClass = 'bangla-text';
            else if (group.id === 'তাৎপর্য') extraClass = 'purport-text';
            else if (group.id === 'শব্দার্থ') extraClass = 'word-meanings';

            const bnDisplay = (group.id === 'শব্দার্থ' && bnContent) ? formatSynonyms(bnContent, '-') : bnContent;
            const enDisplay = (group.id === 'শব্দার্থ' && enContent) ? formatSynonyms(enContent, '—') : enContent;

            html += `
                <div class="field dual-field">
                    ${showTitle ? `<div class="field-title"><span class="bn-part">${group.labelBn}</span> ~ ${group.labelEn}</div>` : ''}
                    <div class="dual-lang-row">
                        ${bnContent ? `<div class="lang-col lang-col-bn field-content ${extraClass}">${bnDisplay}</div>` : ''}
                        ${enContent ? `<div class="lang-col lang-col-en field-content ${extraClass}">${enDisplay}</div>` : ''}
                    </div>
                </div>
            `;
        });

        card.innerHTML = html;
        container.appendChild(card);
    });
}

function renderChapterNavigation(chapterName) {
    const navContainer = document.getElementById('chapterNavigation');
    if (!navContainer) return;

    const currentIndex = appData.সূচীপত্র.findIndex(item => item['Chapter'] === chapterName);
    const prevChapterItem = appData.সূচীপত্র[currentIndex - 1];
    const nextChapterItem = appData.সূচীপত্র[currentIndex + 1];

    let html = '';
    const chapKey = currentLang === 'en' ? 'Chapter(En)' : 'Chapter';

    if (prevChapterItem && prevChapterItem['Chapter']) {
        const prevRefName = prevChapterItem['Chapter'];
        const prevDispName = prevChapterItem[chapKey] || prevRefName;
        html += `
            <button class="nav-btn prev-chap-btn" onclick="renderChapter('${prevRefName}', true)">
                ${UI[currentLang].prevBtnText}: ${prevDispName}
            </button>
        `;
    }

    if (nextChapterItem && nextChapterItem['Chapter']) {
        const nextRefName = nextChapterItem['Chapter'];
        const nextDispName = nextChapterItem[chapKey] || nextRefName;
        html += `
            <button class="nav-btn next-chap-btn" onclick="renderChapter('${nextRefName}', true)">
                ${UI[currentLang].nextBtnText}: ${nextDispName}
            </button>
        `;
    }

    navContainer.innerHTML = html;
}

function backToIndex(){
    document.getElementById('chapterView').style.display = 'none';
    document.getElementById('bookView').style.display = 'block';
    
    // সমাধান: ইন্ডেক্স পেজে ফেরার সময় বর্তমান ভাষা অনুযায়ী রি-রেন্ডার করা
    renderIndex();
    initMainJumpFilter();
    
    document.getElementById('mainChapterSelect').value = "";
    document.getElementById('mainVerseSelect').innerHTML = `<option value="">${UI[currentLang].optVerse}</option>`;
    document.getElementById('mainVerseSelect').disabled = true;

    window.scrollTo({ top:0, behavior:'smooth' });
}

loadData();
