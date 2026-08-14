import React, { useState } from "react";

function readProjectsFromPage() {
    const projects = {};
    document.querySelectorAll("div.o_project_card_container").forEach(project => {
        const name = project.querySelector(".o_sh_display_kanban > div.ps-2 > a")?.textContent;
        projects[`__project__${name}`] = {
            name,
            url: project.querySelector("a.fw-bold")?.getAttribute("href"),
            github: project.querySelector(".border-top > .col:nth-of-type(3) a")?.getAttribute("href"),
            setting: project.querySelector(".border-top > .col:nth-of-type(2) a")?.getAttribute("href"),
            status: project.querySelector("table tbody tr:nth-of-type(2) td")?.textContent,
            version: project.querySelector("table tbody tr:nth-of-type(3) td")?.textContent,
            location: project.querySelector("table tbody tr:nth-of-type(4) td")?.textContent,
        };
    });
    return projects;
}

function SyncButton() {
    const [icon, setIcon] = useState("fa fa-refresh");

    async function handler() {
        const projects = readProjectsFromPage();
        if (!Object.keys(projects).length) {
            return;
        }
        const stored = await chrome.storage.sync.get();
        const staleKeys = Object.keys(stored).filter(key => key.startsWith("__project__"));
        if (staleKeys.length) {
            await chrome.storage.sync.remove(staleKeys);
        }
        await chrome.storage.sync.set(projects);

        setIcon("fa fa-check");
        setTimeout(() => {
            setIcon("fa fa-refresh");
        }, 1000);
    }

    return (
        <button title="Sync projects to Odoo Utility" onClick={handler} className="btn btn-sm btn-link">
            <i className={icon}/> Sync to Odoo Utility
        </button>
    )
}

export default SyncButton;
