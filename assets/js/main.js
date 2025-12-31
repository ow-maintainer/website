// Core logic that runs after assets are loaded by boot.js
window.addEventListener('oxide-ready', () => {
    initTheme();
    initI18n();
    initScrollHeader();

    // Specific page initializers
    if (document.getElementById('jobs-container')) {
        if (window.initJobsEngine) window.initJobsEngine();
    }
    if (document.getElementById('job-detail-view')) {
        if (window.initJobDetail) window.initJobDetail();
    }
});

function initScrollHeader() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
        setTheme(theme);
    } else {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemDark ? 'dark' : 'light');
    }

    const toggles = document.querySelectorAll('.theme-toggle-btn');
    if (toggles.length > 0) {
        // Initialize state for all toggles
        updateThemeIcons(document.documentElement.classList.contains('dark'));

        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isDark = document.documentElement.classList.contains('dark');
                setTheme(isDark ? 'light' : 'dark');
            });
        });
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme === 'dark');
}

function updateThemeIcons(isDark) {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    if (toggles.length === 0) return;

    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    toggles.forEach(toggle => {
        toggle.innerHTML = isDark ? sunIcon : moonIcon;
        toggle.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    });
}

// i18n Management
function initI18n() {
    const currentLang = localStorage.getItem('lang') || 'en';
    applyTranslations(currentLang);

    const langSelectors = document.querySelectorAll('.lang-selector');
    if (langSelectors.length > 0) {
        langSelectors.forEach(selector => {
            selector.value = currentLang;
            selector.addEventListener('change', (e) => {
                const newLang = e.target.value;
                localStorage.setItem('lang', newLang);
                applyTranslations(newLang);

                // Sync other selectors
                langSelectors.forEach(s => s.value = newLang);
            });
        });
    }
}

function applyTranslations(lang) {
    if (!window.OXIDE_TRANSLATIONS) return;
    const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];

    document.documentElement.dir = (['ar', 'ur'].includes(lang)) ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = data[key];
            } else {
                el.textContent = data[key];
            }
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (data[key]) el.title = data[key];
    });
}

window.applyTranslations = applyTranslations;
