(function () {
    // 0. Calculate base path relative to this script
    // boot.js is at assets/js/boot.js
    const scriptsOnPage = document.getElementsByTagName('script');
    const thisScript = scriptsOnPage[scriptsOnPage.length - 1];
    const scriptPath = thisScript.src;
    // Base is two levels up from assets/js/boot.js
    const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('assets/js/'));

    // 1. Inject Style.css immediately
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + 'assets/css/style.css';
    // We do NOT reveal body here anymore. We wait for scripts (Tailwind).
    document.head.appendChild(link);

    // 1.5. Inject Favicon
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = basePath + 'assets/img/logo-icon.svg';
    document.head.appendChild(icon);

    // 2. Load necessary scripts in order
    const scripts = [
        'assets/js/tailwindcss.js',
        'assets/js/tailwind-config.js',
        'assets/translations/en.js',
        'assets/translations/de.js',
        'assets/translations/fr.js',
        'assets/translations/ar.js',
        'assets/translations/es.js',
        'assets/translations/hi.js',
        'assets/translations/ur.js',
        'assets/translations/ja.js',
        'assets/translations/zh.js',
        'assets/data/jobs.js',
        'assets/js/components.js',
        'assets/js/main.js',
        'assets/js/jobs-engine.js'
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            // Prepend basePath to all internal loads
            s.src = basePath + src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // Sequence loading to ensure dependencies are met
    async function init() {
        for (const src of scripts) {
            await loadScript(src).catch(err => console.error(`Failed to load ${src}`, err));
        }

        // Dispatch event when everything is ready
        window.dispatchEvent(new CustomEvent('oxide-ready'));

        // REVEAL BODY ONLY AFTER SCRIPTS (TAILWIND) ARE LOADED
        document.body.style.visibility = 'visible';
    }

    init();
})();
