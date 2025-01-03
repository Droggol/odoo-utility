import React from "react";
import { createRoot } from "react-dom/client";
import LoginButtons from "./components/LoginButtons";

async function init() {
    function onLoginBtnPress(username, password) {
        document.getElementById("login").value = username;
        document.getElementById("password").value = password;
        document.querySelector(".oe_login_form").submit();
    }

    const BLACKLIST_DOMAIN = ["apps.odoo.com", "runbot.odoo.com", "www.odoo.com", "www.odoo.sh"];
    if (!BLACKLIST_DOMAIN.includes(window.location.hostname)) {
        const options = await chrome.runtime.sendMessage({ method: "getOptions" });
        if (options.showLoginButtons && document.getElementsByClassName("oe_login_form").length) {
            if (document.getElementsByClassName("oe_login_form") && document.querySelector(".field-login")) {
                const container = document.createElement("div");
                document.querySelector(".oe_login_form").insertBefore(container, document.querySelector(".field-login"));
                const root = createRoot(container);
                root.render(<LoginButtons showCustomBtn={options.showCustomLoginButton} customBtnUsername={options.customLoginButtonUsername} customBtnPassword={options.customLoginButtonPassword} callback={onLoginBtnPress} />);
            }
        }
    }
}

init();
