import React from "react";

export default function ShortcutButton ({ info }) {
    return (
        <div className={`p1 ${info.size && info.size === "full" ? "col-span-2" : ""}`}>
            <div className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-md relative">
                <div className="flex items-center p-2">
                    <div className="shrink-0">
                        <div className={`rounded-full h-8 w-8 leading-8 text-sm text-center ${info.color}`}>
                            <i className={`bi bi-${info.icon}`}></i>
                        </div>
                    </div>
                    <div className="grow ml-2">
                        <a href={info.link} target="_blank">
                            <h6 className="text-sm font-medium">{info.title}</h6>
                        </a>
                    </div>
                    {info.shortcuts && info.shortcuts.map(shortcut =>
                        <a key={shortcut.title} href={shortcut.link} target="_blank" className={`rounded-md px-2 py-1.5 ml-2 text-xs ${info.shortcutColor}`}>
                            {shortcut.title}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
