import React, { useState } from "react";

function SyncButton({ projects }) {
    const [icon, setIcon] = useState("fa fa-refresh");

    function handler() {
        chrome.storage.sync.set(projects);
        setIcon("fa fa-check");
        setTimeout(() => {
            setIcon("fa fa-refresh");
        }, 1000);
    }

    return (
        <button title="Sync projects to Odoo Utility" onClick={() => handler()} className="btn btn-sm btn-link font-weight-bold">
            <i className={icon}/> Sync to Odoo Utility
        </button>
    )
}

export default SyncButton;
