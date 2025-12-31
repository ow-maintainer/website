class OxideHeader extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const isJobs = path.includes('jobs.html');
        // isHome is true only for / or index.html
        const isHome = (path === '/' || path.endsWith('index.html') || path.endsWith('/'));

        const updateLogo = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const logoImg = this.querySelector('#header-logo');
            if (logoImg) {
                // In dark mode we need white text (logo-light.svg)
                // In light mode we need dark text (logo-dark.svg)
                logoImg.src = isDark ? 'assets/img/logo-light.svg' : 'assets/img/logo-dark.svg';
            }
        };

        this.innerHTML = `
            <nav class="glass-nav">
                <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-[1001]">
                    <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.href='./'">
                        <!-- User requested h-12 -->
                        <img id="header-logo" src="assets/img/logo-light.svg" alt="Oxideworks" class="h-12">
                    </div>

                    <div class="flex items-center gap-8">
                        <div class="hidden md:flex gap-8 font-medium">
                            <a href="./" class="${isHome ? 'text-rust' : 'hover:text-rust transition-colors'}" data-i18n="nav_home">Home</a>
                            <a href="jobs.html" class="${isJobs ? 'text-rust' : 'hover:text-rust transition-colors'}" data-i18n="nav_jobs">Jobs</a>
                        </div>

                        <!-- Desktop Controls (Hidden on Mobile) -->
                        <div class="hidden md:flex items-center gap-4">
                            <select class="lang-selector bg-transparent border border-rust/20 rounded px-2 py-1 text-sm outline-none">
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                                <option value="fr">Français</option>
                                <option value="ar">العربية</option>
                                <option value="es">Español</option>
                                <option value="hi">हिन्दी</option>
                                <option value="ur">اردو</option>
                                <option value="ja">日本語</option>
                                <option value="zh">简体中文</option>
                            </select>
                            <button class="theme-toggle-btn p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-sm font-medium">
                                <!-- Icon will be injected by main.js -->
                            </button>
                        </div>
                            
                        <!-- Mobile Menu Button (Hidden on Desktop) -->
                        <button id="mobile-menu-btn" class="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-rust">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Mobile Menu Overlay -->
            <!-- Moved outside nav to avoid stacking context/clipping issues with fixed position -->
            <div id="mobile-menu" class="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-[2000] transform transition-transform duration-300 translate-x-full md:hidden flex flex-col items-center justify-center gap-6 opacity-0 pointer-events-none">
                <button id="close-menu-btn" class="absolute top-8 right-6 p-2 hover:bg-white/10 rounded-lg text-rust">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <a href="./" class="text-3xl font-bold ${isHome ? 'text-rust' : 'text-white hover:text-rust'} transition-colors" data-i18n="nav_home">Home</a>
                <a href="jobs.html" class="text-3xl font-bold ${isJobs ? 'text-rust' : 'text-white hover:text-rust'} transition-colors" data-i18n="nav_jobs">Jobs</a>

                <!-- Mobile Controls (Language & Theme) -->
                <div class="flex items-center gap-6 mt-8">
                    <select class="lang-selector bg-transparent border border-rust/50 rounded px-4 py-2 text-lg outline-none text-white">
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ur">اردو</option>
                        <option value="ja">日本語</option>
                        <option value="zh">简体中文</option>
                    </select>
                    <button class="theme-toggle-btn p-3 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white border border-rust/50">
                        <!-- Icon will be injected by main.js -->
                    </button>
                </div>
            </div>
        `;

        // Mobile Menu Logic
        // Use setTimeout to ensure DOM is ready (defensive)
        setTimeout(() => {
            const mobileBtn = this.querySelector('#mobile-menu-btn');
            const closeBtn = this.querySelector('#close-menu-btn');
            const mobileMenu = this.querySelector('#mobile-menu');

            if (mobileBtn && closeBtn && mobileMenu) {
                const toggleMenu = (show) => {
                    if (show) {
                        mobileMenu.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
                        document.body.style.overflow = 'hidden';
                    } else {
                        mobileMenu.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
                        document.body.style.overflow = '';
                    }
                };

                mobileBtn.addEventListener('click', () => toggleMenu(true));
                closeBtn.addEventListener('click', () => toggleMenu(false));

                // Close on link click
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => toggleMenu(false));
                });
            } else {
                console.error('Mobile menu elements not found inside oxide-header');
            }
        }, 0);

        // Initialize logo based on current theme
        updateLogo();

        // Observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateLogo();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    }
}

class OxideFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="py-12 border-t border-white/5 relative z-10 glass-card mt-12 bg-white/5">
                <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div class="flex items-center gap-2">
                        <img src="assets/img/logo-icon.svg" alt="Oxideworks" class="w-8 h-8">
                        <div class="text-sm opacity-50" data-i18n="footer_rights">© 2026 Oxideworks. All rights reserved.</div>
                    </div>

                    <div class="flex gap-4">
                        <a href="https://linkedin.com/company/oxideworks" target="_blank" class="p-2 hover:bg-white/10 rounded-full transition-colors text-rust">
                            <span class="sr-only">LinkedIn</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                        <a href="https://github.com/oxide-works" target="_blank" class="p-2 hover:bg-white/10 rounded-full transition-colors text-rust">
                            <span class="sr-only">GitHub</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('oxide-header', OxideHeader);
customElements.define('oxide-footer', OxideFooter);
