const OPTIONS = {
    showLoginButtons: true,
    showCustomLoginButton: false,
    customLoginButtonUsername: '',
    customLoginButtonPassword: '',
    showNavigationButton: false,
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
    return true;
});
