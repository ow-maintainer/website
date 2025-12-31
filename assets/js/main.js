document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initI18n();
    initScrollHeader();

    // Dispatch event for jobs engine to know main is ready
    if (typeof window.OXIDE_JOBS_INDEX === 'undefined') {
        console.warn('Jobs data not loaded. Check script imports.');
    }
});

function initScrollHeader() {
    const nav = document.querySelector('nav');
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
    // Check if user has manually set a theme
    const theme = localStorage.getItem('theme');

    // Initial load: logic to determine state
    if (theme) {
        setTheme(theme);
    } else {
        // If no saved preference, check system
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemDark ? 'dark' : 'light');
    }

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        // Update icon based on current state
        updateThemeIcon(document.documentElement.classList.contains('dark'));

        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
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
    updateThemeIcon(theme === 'dark');
}

function updateThemeIcon(isDark) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Simple Sun/Moon SVG Icons
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    toggle.innerHTML = isDark ? sunIcon : moonIcon;
    toggle.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
}

// i18n Management
let currentLang = 'en';

function initI18n() {
    currentLang = localStorage.getItem('lang') || 'en';

    // Check if translations loaded from JS file
    if (typeof window.OXIDE_TRANSLATIONS === 'undefined') {
        console.error('Translation data not found!');
        return;
    }

    applyTranslations(currentLang);

    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.value = currentLang; // Sync dropdown visual state
        langSelector.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('lang', newLang);
            currentLang = newLang;
            applyTranslations(newLang);
            window.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
        });
    }

    // Force application on init guarantees content matches localStorage
    applyTranslations(currentLang);
}

function applyTranslations(lang) {
    const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];
    // Debugging: Log active language and data availability
    console.log(`Applying translations for: ${lang}`, data ? 'Data found' : 'Data missing');


    // Handle RTL
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
}
