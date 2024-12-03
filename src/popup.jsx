import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions
} from '@headlessui/react';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { FolderIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import ShortcutButton from "./components/ShortcutButton";

import "./styles/tailwind.css";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Popup = () => {
    const [options, setOptions] = useState({});
    const [query, setQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [projects, setProjects] = useState({});

    const SHORTCUTS = [{
        icon: "globe",
        color: "bg-primary-700 text-white",
        link: "https://odoo.com",
        title: "Odoo",
    }, {
        icon: "cloud-fill",
        color: "bg-primary-700 text-white",
        link: "https://www.odoo.sh",
        title: "Odoo.sh",
        shortcutColor: "bg-primary-100 text-primary-700 hover:bg-primary-700 hover:text-white dark:bg-primary-700 dark:text-primary-100 dark:hover:opacity-60",
        shortcuts: [{
            title: "Projects",
            link: "https://www.odoo.sh/project",
        }],
    }, {
        icon: "robot",
        color: "bg-green-700 text-white",
        link: "https://runbot.odoo.com",
        title: "Runbot",
    }, {
        icon: "patch-question",
        color: "bg-red-700 text-white",
        link: "https://www.odoo.com/help",
        title: "Odoo Support",
        shortcutColor: "bg-red-100 text-red-700 hover:bg-red-700 hover:text-white dark:bg-red-700 dark:text-red-100 dark:hover:opacity-60",
        shortcuts: [{
            title: "Tickets",
            link: "https://www.odoo.com/my/tasks",
        }],
    }, {
        icon: "card-text",
        color: "bg-purple-700 text-white",
        link: "https://www.odoo.com/forum/help-1",
        title: "Forum",
    }, {
        icon: "boxes",
        color: "bg-blue-700 text-white",
        link: "https://apps.odoo.com",
        title: "Apps Store",
        shortcutColor: "bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white dark:bg-blue-700 dark:text-blue-100 dark:hover:opacity-60",
        shortcuts: [{
            title: "Apps",
            link: "https://apps.odoo.com/apps/modules",
        }, {
            title: "Themes",
            link: "https://apps.odoo.com/apps/themes",
        }],
    }, {
        icon: "book",
        color: "bg-pink-700 text-white",
        link: "https://www.odoo.com/documentation",
        title: "Documentation",
        size: "full",
        shortcutColor: "bg-pink-100 text-pink-700 hover:bg-pink-700 hover:text-white dark:bg-pink-700 dark:text-pink-100 dark:hover:opacity-60",
        shortcuts: [{
            title: "Videos",
            link: "https://www.odoo.com/slides/all",
        }, {
            title: "User Docs",
            link: "https://www.odoo.com/documentation/latest/applications.html",
        }, {
            title: "Developer",
            link: "https://www.odoo.com/documentation/latest/developer.html",
        }, {
            title: "Installation",
            link: "https://www.odoo.com/documentation/latest/administration.html",
        }],
    }, {
        icon: "github",
        color: "bg-slate-700 text-white",
        link: "https://github.com/odoo",
        title: "Github",
        size: "full",
        shortcutColor: "bg-slate-200 text-slate-700 hover:bg-slate-700 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:opacity-60",
        shortcuts: [{
            title: "Source Code",
            link: "https://github.com/odoo/odoo/tree/master",
        }, {
            title: "Issues",
            link: "https://github.com/odoo/odoo/issues",
        }, {
            title: "PR",
            link: "https://github.com/odoo/odoo/pulls",
        }],
    }];

    useEffect(() => {
        async function fetchData() {
            const _options = await chrome.storage.sync.get();
            setOptions(_options);
            switch (_options.theme) {
                case "system":
                    if (!window.matchMedia) {
                        setDarkMode(false);
                    }
                    const query = window.matchMedia("(prefers-color-scheme: dark)");
                    if (query.matches) {
                        setDarkMode(true);
                    } else {
                        setDarkMode(false);
                    }
                    break;
                case "dark":
                    setDarkMode(true);
                    break;
                case "light":
                    setDarkMode(false);
                    break;
            }
            const query = window.matchMedia("(prefers-color-scheme: dark)");
            query.addEventListener("change", ev => {
                if (_options.theme === "system") {
                    if (ev.matches) {
                        setDarkMode(true);
                    } else {
                        setDarkMode(false);
                    }
                }
            });
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const _options = await chrome.storage.sync.get();
            if (query === '') {
                setProjects({});
            } else {
                const filteredProjects = {};
                for (const key in _options) {
                    if (key.startsWith("__project__") && _options[key].name.toLowerCase().includes(query.toLowerCase())) {
                        filteredProjects[_options[key].name] = _options[key];
                    }
                }
                setProjects(filteredProjects);
            }
        };
        fetchData();
    }, [query]);

    return (
        <div className="w-[45rem]" data-mode={darkMode ? "dark" : ""}>
            <div className="flex items-center justify-between p-3 dark:bg-gray-800">
                <div className="flex items-center">
                    <img src="./media/icon128.png" className="max-h-[30px]"/>
                    <h2 className="font-medium text-lg ml-3 dark:text-gray-300">Odoo Utility</h2>
                </div>
                <a href="#" onClick={() => chrome.tabs.create({ url: "options.html" })} className="text-base mx-2 text-primary-800 hover:text-primary-600 dark:text-gray-300 dark:hover:text-gray-400" title="Open Settings">
                    <i className="bi-gear"></i>
                </a>
            </div>
            <div className="p-2 space-y-2 bg-gray-200 dark:bg-gray-700">
                { options.showOdooShProjects &&
                    <div className="overflow-y-auto">
                        <div className="overflow-hidden rounded-md bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-600 border border-gray-200 dark:border-gray-600">
                            <Combobox onChange={(ev) => ev ? chrome.tabs.create({ url: `https://www.odoo.sh${ev.url}` }) : ''} onClose={() => setQuery('')}>
                                {({ activeOption }) => (
                                    <>
                                        <div className="grid grid-cols-1">
                                            <ComboboxInput
                                                autoFocus
                                                className="col-start-1 row-start-1 h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 dark:text-white focus:ring-0 sm:text-sm"
                                                placeholder="Odoo.sh"
                                                onChange={(event) => setQuery(event.target.value)}
                                                onBlur={() => setQuery('')}
                                            />
                                            <MagnifyingGlassIcon
                                                className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        {(query && Object.keys(projects).length > 0) &&
                                            <ComboboxOptions as="div" static hold className="flex transform-gpu divide-x divide-gray-100 dark:divide-gray-600">
                                                <div
                                                    className={classNames(
                                                        'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                                                        activeOption && 'sm:h-96',
                                                    )}
                                                >
                                                    <div className="-mx-2 text-sm text-gray-700 dark:text-gray-400">
                                                        {Object.entries(projects).map(([key, value]) => (
                                                            <ComboboxOption
                                                                as="div"
                                                                key={key}
                                                                value={value}
                                                                className="group flex cursor-default select-none items-center rounded-md p-2 data-[focus]:bg-gray-100 dark:data-[focus]:bg-gray-600 dark:data-[focus]:text-white data-[focus]:outline-none"
                                                            >
                                                                <span className="ml-3 flex-auto truncate">{value.name}</span>
                                                                <ChevronRightIcon
                                                                    className="ml-3 hidden size-5 flex-none text-gray-400 group-data-[focus]:block"
                                                                    aria-hidden="true"
                                                                />
                                                            </ComboboxOption>
                                                        ))}
                                                    </div>
                                                </div>
                                                {activeOption && (
                                                    <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                                                        <div className="flex flex-auto flex-col justify-between p-6">
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700 dark:text-gray-200">
                                                                <dt className="col-end-1 font-semibold text-gray-900 dark:text-gray-400">Status</dt>
                                                                <dd>{activeOption.status}</dd>
                                                                <dt className="col-end-1 font-semibold text-gray-900 dark:text-gray-400">Version</dt>
                                                                <dd>{activeOption.version}</dd>
                                                                <dt className="col-end-1 font-semibold text-gray-900 dark:text-gray-400">Location</dt>
                                                                <dd>{activeOption.location}</dd>
                                                                <dt className="col-end-1 font-semibold text-gray-900 dark:text-gray-400">Github</dt>
                                                                <dd className="truncate">
                                                                    <a href="#" onClick={() => chrome.tabs.create({ url: activeOption.github })} className="text-indigo-700 dark:text-white underline">
                                                                        {activeOption.name}
                                                                    </a>
                                                                </dd>
                                                            </dl>
                                                            <button
                                                                type="button"
                                                                onClick={(ev) => chrome.tabs.create({ url: `https://www.odoo.sh${activeOption.url}` })}
                                                                className="mt-6 w-full rounded-md bg-primary-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                                            >
                                                                Go to Project
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </ComboboxOptions>
                                        }
                                        {query !== '' && Object.keys(projects).length === 0 && (
                                            <div className="px-6 py-14 text-center sm:px-14">
                                                <FolderIcon className="mx-auto size-6 text-gray-400" aria-hidden="true" />
                                                <p className="mt-4 text-sm text-gray-900 dark:text-white">
                                                    We couldn't find any projects with that term. Please try changing term or sync projects with Odoo.sh.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Combobox>
                        </div>
                    </div>
                }
                { !query &&
                    <div className="grid grid-cols-2 gap-1">
                        {SHORTCUTS.map(button =>
                            <ShortcutButton key={button.title} info={button} />
                        )}
                    </div>
                }
            </div>
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Popup />);
