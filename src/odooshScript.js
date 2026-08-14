import React from "react";
import { createRoot } from "react-dom/client";
import SyncButton from "./odooshScript";

function waitForElement(selector, { timeout = 15000, root = document.body || document.documentElement } = {}) {
    const existing = document.querySelector(selector);
    if (existing) {
        return Promise.resolve(existing);
    }
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(root, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timed out waiting for ${selector}`));
        }, timeout);
    });
}

async function init() {
    const options = await chrome.storage.sync.get();
    if (!options.showOdooShProjects) {
        return;
    }

    const toolbar = await waitForElement("div.o_project_container > div > div.flex-grow-1");
    const appContainer = document.createElement("div");
    appContainer.classList.add("d-inline-block");
    toolbar.appendChild(appContainer);
    const root = createRoot(appContainer);
    root.render(<SyncButton />);
}

init();
