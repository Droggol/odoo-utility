import React from "react";
import { createRoot } from "react-dom/client";
import SyncButton from "./odooshScript";

async function init() {
    const options = await chrome.storage.sync.get();
    if (!options.showOdooShProjects) {
        return;
    }
    const projects = {};
    document.querySelectorAll("div.o_project_card_container").forEach(project => {
        projects[`__project__${project.dataset.name}`] = {
            name: project.dataset.name,
            url: project.querySelector("a.font-weight-bold").getAttribute("href"),
            github: project.querySelector('.border-top > .col:nth-of-type(3) a').getAttribute("href"),
            setting: project.querySelector('.border-top > .col:nth-of-type(2) a').getAttribute("href"),
            status: project.querySelector('table tbody tr:nth-of-type(2) td').textContent,
            version: project.querySelector('table tbody tr:nth-of-type(3) td').textContent,
            location: project.querySelector('table tbody tr:nth-of-type(4) td').textContent,
        };
    });
    const appContainer = document.createElement("div");
    appContainer.classList.add("d-inline-block");
    document.querySelector("div.o_project_container > div > div.flex-grow-1").appendChild(appContainer);
    const root = createRoot(appContainer);
    root.render(<SyncButton projects={projects} />);
}

init();
