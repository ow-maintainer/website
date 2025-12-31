function renderJobs(jobs) {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    container.innerHTML = '';

    if (jobs.length === 0) {
        const lang = localStorage.getItem('lang') || 'en';
        const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];
        container.innerHTML = `<p class="text-center py-10 opacity-60">${data['no_jobs_found'] || 'No jobs found matching your criteria.'}</p>`;
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'glass-card p-6 rounded-xl border border-white/10 hover:border-rust/50 transition-all cursor-pointer group';
        card.onclick = () => window.location.href = `job-detail.html?id=${job.id}`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold group-hover:text-rust transition-colors">${job.title}</h3>
                ${job.is_external ? `<span class="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 rounded text-slate-800 dark:text-slate-200" data-i18n="external_job">External</span>` : ''}
            </div>
            <div class="flex gap-4 text-sm opacity-70 mb-4">
                <span>📍 ${job.country}</span>
                <span>💼 ${job.type}</span>
            </div>
            <div class="flex justify-end">
                 <span class="text-rust font-medium group-hover:translate-x-1 transition-transform" data-i18n="view_details">View Details →</span>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-apply translations for dynamic content
    if (window.OXIDE_TRANSLATIONS) {
        // Manually trigger simple translation for new elements if main.js functions aren't exposed globally (though they aren't).
        // Best approach in vanilla JS without modules: re-run the DOM scan logic. 
        // We can just rely on main.js's "langChanged" event listener if we dispatch one, but this is initial render.
        // We'll duplicate the small logic or better yet, make applyTranslations global in main.js. 
        // For now, let's just grab the current language and apply.
        const lang = localStorage.getItem('lang') || 'en';
        const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];
        container.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) el.textContent = data[key];
        });
    }
}
// ... rest of file (loadJobDetail, initJobsListing) stays same ...

function loadJobDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        window.location.href = 'jobs.html';
        return;
    }

    if (typeof window.OXIDE_JOBS_DETAILS === 'undefined') {
        console.error('Job details data missing.');
        return;
    }

    const job = window.OXIDE_JOBS_DETAILS[id];

    if (!job) {
        const lang = localStorage.getItem('lang') || 'en';
        const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];
        document.getElementById('job-description').innerHTML = `<p>${data['job_not_found'] || 'Job not found.'}</p>`;
        return;
    }

    const lang = localStorage.getItem('lang') || 'en';
    const data = window.OXIDE_TRANSLATIONS[lang] || window.OXIDE_TRANSLATIONS['en'];

    document.getElementById('job-title').textContent = job.title;
    document.getElementById('job-meta').textContent = `${job.country} • ${job.type} • ${data['posted_on'] || 'Posted'} ${job.posted_date}`;
    document.getElementById('job-description').innerHTML = job.description_html;

    const applyBtn = document.getElementById('apply-btn');
    applyBtn.href = job.apply_url;
    if (job.is_external) {
        applyBtn.target = "_blank";
        document.getElementById('external-note').classList.remove('hidden');
    }
}

function initJobsListing() {
    // Check for data
    if (typeof window.OXIDE_JOBS_INDEX === 'undefined') {
        console.error('Jobs data missing. Make sure jobs.js is loaded.');
        return;
    }

    const allJobs = window.OXIDE_JOBS_INDEX;
    renderJobs(allJobs);

    const searchInput = document.getElementById('job-search');
    const countryFilter = document.getElementById('country-filter');

    const filterFunc = () => {
        const query = searchInput.value.toLowerCase();
        const country = countryFilter.value;

        const filtered = allJobs.filter(job => {
            const matchesQuery = job.title.toLowerCase().includes(query) || job.country.toLowerCase().includes(query);
            const matchesCountry = country === "" || job.country === country;
            return matchesQuery && matchesCountry;
        });
        renderJobs(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', filterFunc);
    if (countryFilter) countryFilter.addEventListener('change', filterFunc);

    // Populate country filter uniquely
    if (countryFilter && countryFilter.options.length <= 1) {
        const countries = [...new Set(allJobs.map(j => j.country))];
        countries.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            countryFilter.appendChild(opt);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('jobs-container')) {
        initJobsListing();
    }
    if (document.getElementById('job-detail-view')) {
        loadJobDetail();
    }
});
