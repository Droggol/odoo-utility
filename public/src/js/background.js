const OPTIONS = {
    showLoginButtons: true,
    showCustomLoginButton: false,
    customLoginButtonUsername: '',
    customLoginButtonPassword: '',
    showNavigationButton: true,
    themePreference: 'auto',
};

chrome.runtime.onInstalled.addListener(details => {
    chrome.storage.sync.set(OPTIONS);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == 'getOptions') {
        chrome.storage.sync.get(null, options =>{
            sendResponse(options);
        });
    }
    if (request.method == 'disableNavigationButton') {
        chrome.storage.sync.set({showNavigationButton: false}, () => {
            sendResponse();
        });
    }
    return true;
});
