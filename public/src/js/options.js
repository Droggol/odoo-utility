const SELECTORS = {
    showLoginButtons: 'show-login-buttons',
    showCustomLoginButton: 'show-custom-login-button',
    customLoginButtonUsername: 'custom-login-button-username',
    customLoginButtonPassword: 'custom-login-button-password',
    showNavigationButton: 'show-navigation-button',
};

for (const [key, value] of Object.entries(SELECTORS)) {
    const element = document.getElementById(value);
    // Set initial values
    chrome.storage.sync.get(key, items => {
        switch (typeof(items[key])) {
            case 'string':
                element.value = items[key];
                break;
            case 'boolean':
                element.checked = items[key];
                break;
        }
    });
    // Set modified values
    element.addEventListener('change', event => {
        let values = {};
        switch (event.target.getAttribute('type')) {
            case 'text':
                values[key] = event.target.value;
                break;
            case 'checkbox':
                values[key] = event.target.checked;
                break;
        }
        chrome.storage.sync.set(values);
    });
}

// Set version name
document.getElementById('version-name').textContent = chrome.runtime.getManifest().version;
