const BLACKLIST_DOMAIN = ['apps.odoo.com', 'runbot.odoo.com', 'www.odoo.com', 'www.odoo.sh'];

if (!BLACKLIST_DOMAIN.includes(window.location.hostname)) {
    // Inject script
    const scriptEl = document.createElement('script');
    scriptEl.src = chrome.runtime.getURL('/src/js/page_script.js');
    (document.head || document.documentElement).appendChild(scriptEl);
    scriptEl.onload = () => scriptEl.parentNode.removeChild(scriptEl);

    window.addEventListener('message', event => {
        if (event.data && event.data.isOdooPage) {
            chrome.runtime.sendMessage({method: 'getOptions'}, options => {
                // Add login buttons
                if (document.getElementsByClassName('oe_login_form') && document.querySelector('.field-login')) {
                    if (options.showLoginButtons) {
                        const CUSTOM_BUTTON_TEMPLATE = `<a href="#" class="btn btn-primary" data-username="${options.customLoginButtonUsername}" data-password="${options.customLoginButtonPassword}" title="Login as ${options.customLoginButtonUsername} user">${options.customLoginButtonUsername}</a>`;
                        const BUTTONS_TEMPLATE = `\
                            <div class="form-group mb-2 text-center">
                                <div class="small mb-1">Login as</div>
                                <div class="btn-group btn-group-sm ou-login-buttons">
                                    ${options.showCustomLoginButton && options.customLoginButtonUsername ? CUSTOM_BUTTON_TEMPLATE : ''}
                                    <a href="#" class="btn btn-primary" data-username="admin" data-password="admin" title="Login as admin user">Admin</a>
                                    <a href="#" class="btn btn-primary" data-username="demo" data-password="demo" title="Login as demo user">Demo</a>
                                    <a href="#" class="btn btn-primary" data-username="portal" data-password="portal" title="Login as portal user">Portal</a>
                                </div>
                            </div>
                        `;
                        const loginEl = document.querySelector('.field-login');
                        loginEl.insertAdjacentHTML('beforeBegin', BUTTONS_TEMPLATE);
            
                        document.querySelector('.ou-login-buttons').addEventListener('click', event => {
                            event.preventDefault();
                            document.getElementById('login').value = event.target.dataset.username;
                            document.getElementById('password').value = event.target.dataset.password;
                            document.querySelector('.oe_login_form').submit();
                        });
                    }
                }
    
                // Add navigation button
                if (options.showNavigationButton && !window.location.pathname.includes('/pos/')) {
                    let navigationMode = 'Backend';
                    if (window.location.pathname === '/web' && document.body.classList.contains('o_web_client')) {
                        navigationMode = 'Frontend';
                    }
    
                    const NAVIGATION_BUTTON_TEMPLATE = `\
                        <div class="ou-navigation-button ou-clickable-button">
                            Go to ${navigationMode}
                        </div>
                        <div class="dropdown">
                            <div class="ou-more-button ou-clickable-button dropdown-toggle" data-toggle="dropdown" data-bs-toggle="dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                            </div>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="/web/login">Login</a>
                                <a class="dropdown-item" href="/shop">Shop</a>
                                <a class="dropdown-item" href="/my/home">Portal</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/web/database/selector">Database Manager</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item small ou-hide" href="#" style="font-size: 11px;">
                                    <div class="text-danger"><i class="fa fa-eye-slash"></i> Hide</div>
                                    <i>You can turn on later from options.</i>
                                </a>
                            </div>
                        </div>
                    `;
                    const navigationEl = document.createElement('div');
                    navigationEl.classList.add('ou-navigation-button-container');
                    navigationEl.innerHTML = NAVIGATION_BUTTON_TEMPLATE;
                    document.body.appendChild(navigationEl);
    
                    navigationEl.querySelector('.ou-navigation-button').addEventListener('click', event => {
                        if (navigationMode === 'Backend') {
                            window.location.replace(`${window.location.origin}/web`);
                        } else {
                            window.location.replace(window.location.origin);
                        }
                    });

                    navigationEl.querySelector('.ou-hide').addEventListener('click', event => {
                        event.preventDefault();
                        chrome.runtime.sendMessage({method: 'disableNavigationButton'}, () => {
                            navigationEl.remove();
                        });
                    });
                }
            });
        }
    }, false);
}
