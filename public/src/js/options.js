const SELECTORS = {
    showLoginButtons: {selector: 'show-login-buttons', type: 'boolean'},
    showCustomLoginButton: {selector: 'show-custom-login-button', type: 'boolean'},
    customLoginButtonUsername: {selector: 'custom-login-button-username', type: 'text'},
    customLoginButtonPassword: {selector: 'custom-login-button-password', type: 'text'},
    showNavigationButton: {selector: 'show-navigation-button', type: 'boolean'},
    themePreference: {selector: 'theme-preference', type: 'selection'},
};

for (const [key, value] of Object.entries(SELECTORS)) {
    const element = document.getElementById(value.selector);
    // Set initial values
    chrome.storage.sync.get(key, items => {
        switch (value.type) {
            case 'text':
                element.value = items[key];
                break;
            case 'boolean':
                element.checked = items[key];
                break;
            case 'selection':
                element.value = items[key];
                break;
        }
    });
    // Set modified values
    element.addEventListener('change', event => {
        let values = {};
        switch (event.currentTarget.dataset.type) {
            case 'text':
                values[key] = event.currentTarget.value;
                break;
            case 'boolean':
                values[key] = event.currentTarget.checked;
                break;
            case 'selection':
                values[key] = event.currentTarget.value;
                break;
        }
        chrome.storage.sync.set(values);
    });
}

// Set version name
document.getElementById('version-name').textContent = chrome.runtime.getManifest().version;
