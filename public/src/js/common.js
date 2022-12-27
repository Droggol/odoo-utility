export function initTheme() {
    chrome.runtime.sendMessage({ method: 'getOptions' }, options => {
        toggleTheme(options.themePreference);
    });
}

export function toggleTheme(themePreference) {
    switch (themePreference) {
        case 'auto':
            document.querySelector('html').dataset.bsTheme = 'light';
            if (!window.matchMedia) {
                return;
            }
            const query = window.matchMedia('(prefers-color-scheme: dark)');
            query.addEventListener('change', ev => {
                if (ev.matches) {
                    document.querySelector('html').dataset.bsTheme = 'dark';
                } else {
                    document.querySelector('html').dataset.bsTheme = 'light';
                }
            });
            if (query.matches) {
                document.querySelector('html').dataset.bsTheme = 'dark';
            }
            break;
        case 'dark':
            document.querySelector('html').dataset.bsTheme = 'dark';
            break;
        case 'light':
            document.querySelector('html').dataset.bsTheme = 'light';
            break;
    }
}
