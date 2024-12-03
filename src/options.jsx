import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tailwind.css";

const OptionsPage = () => {
    const [options, setOptions] = useState({
        showOdooShProjects: true,
        showLoginButtons: true,
        showCustomLoginButton: false,
        customLoginButtonUsername: "",
        customLoginButtonPassword: "",
        theme: "system",
    });

    const [clearingShProjects, setClearingShProjects] = useState(false);

    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            chrome.storage.sync.get(Object.keys(options), items => {
                setOptions({
                    ...options,
                    ...items
                });
            });
            return;
        } else {
            chrome.storage.sync.set(options);
        }

        // Dark Mode
        chrome.storage.sync.get(options => {
            switch (options.theme) {
                case "system":
                    if (!window.matchMedia) {
                        document.body.dataset.mode = "";
                        document.body.classList.remove("dark:bg-gray-800");
                    }
                    const query = window.matchMedia("(prefers-color-scheme: dark)");
                    if (query.matches) {
                        document.body.dataset.mode = "dark";
                        document.body.classList.add("dark:bg-gray-800");
                    } else {
                        document.body.dataset.mode = "";
                        document.body.classList.remove("dark:bg-gray-800");
                    }
                    break;
                case "dark":
                    document.body.dataset.mode = "dark";
                    document.body.classList.add("dark:bg-gray-800");
                    break;
                case "light":
                    document.body.dataset.mode = "";
                    document.body.classList.remove("dark:bg-gray-800");
                    break;
            }
        });

        // Listen for Dark Mode
        const query = window.matchMedia("(prefers-color-scheme: dark)");
        async function listenDarkModeChange(ev) {
            const options = await chrome.storage.sync.get();
            if (options.theme === "system") {
                if (ev.matches) {
                    document.body.dataset.mode = "dark";
                    document.body.classList.add("dark:bg-gray-800");
                } else {
                    document.body.dataset.mode = "";
                    document.body.classList.remove("dark:bg-gray-800");
                }
            }
        }
        query.addEventListener("change", listenDarkModeChange);
        return () => {
            query.removeEventListener("change", listenDarkModeChange);
        };
    }, [options]);

    async function clearOdooShProjects() {
        setClearingShProjects(true);
        const _options = await chrome.storage.sync.get();
        const filteredProjects = [];
        for (const key in _options) {
            if (key.startsWith("__project__")) {
                filteredProjects.push(key);
            }
        }
        await chrome.storage.sync.remove(filteredProjects);
        setTimeout(() => {
            setClearingShProjects(false);
        }, 1000);
    }

    return (
        <div className="mt-[40px] mb-[20px] mx-auto w-[550px]">
            <form className="dark:bg-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 sm:rounded-md md:col-span-2">
                <div className="flex items-center p-4 border-b shadow-sm dark:border-gray-600">
                    <div className="shrink">
                        <img src="media/icon128.png" className="max-h-[50px]" />
                    </div>
                    <div className="grow ms-3">
                        <h5 className="text-lg dark:text-white">Odoo Utility</h5>
                        <h6 className="text-sm dark:text-white">Settings</h6>
                    </div>
                    <div className="text-sm dark:text-white">v{chrome.runtime.getManifest().version}</div>
                </div>
                <div className="p-4">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
                        <div className="col-span-full space-y-2">
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input id="show-login-buttons" checked={options.showLoginButtons} onChange={e => {
                                        setOptions({
                                            ...options,
                                            showLoginButtons: e.target.checked
                                        });
                                    }} name="show-login-buttons" type="checkbox" className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-white/10 dark:bg-white/5 dark:focus:ring-offset-gray-800" />
                                </div>
                                <div className="ml-3 text-sm/6">
                                    <label htmlFor="show-login-buttons" className="font-medium text-gray-900 dark:text-slate-300">Show login buttons</label>
                                </div>
                            </div>
                            {options.showLoginButtons &&
                                <div className="relative flex items-start">
                                    <div className="flex h-6 items-center">
                                        <input id="show-custom-login-button" checked={options.showCustomLoginButton} onChange={e => {
                                            setOptions({
                                                ...options,
                                                showCustomLoginButton: e.target.checked
                                            });
                                        }} name="show-custom-login-button" type="checkbox" className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-white/10 dark:bg-white/5 dark:focus:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm/6">
                                        <label htmlFor="show-custom-login-button" className="font-medium text-gray-900 dark:text-slate-300">Show custom login button</label>
                                    </div>
                                </div>
                            }
                        </div>
                        {(options.showLoginButtons && options.showCustomLoginButton) &&
                            <>
                                <div className="sm:col-span-3">
                                    <label htmlFor="custom-login-button-username" className="block text-sm/6 font-medium text-gray-900 dark:text-slate-300">Custom Username</label>
                                    <div className="mt-2">
                                        <input type="text" value={options.customLoginButtonUsername} onChange={e => {
                                            setOptions({
                                                ...options,
                                                customLoginButtonUsername: e.target.value
                                            });
                                        }} name="custom-login-button-username" id="custom-login-button-username" className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white dark:bg-white/5 shadow-sm ring-1 ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm/6"/>
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="custom-login-button-password" className="block text-sm/6 font-medium text-gray-900 dark:text-slate-300">Custom Password <i title="Don't save your production password. This is for development purpose only." className="bi bi-info-circle"></i></label>
                                    <div className="mt-2">
                                        <input type="text" value={options.customLoginButtonPassword} onChange={e => {
                                            setOptions({
                                                ...options,
                                                customLoginButtonPassword: e.target.value
                                            });
                                        }} name="custom-login-button-password" id="custom-login-button-password" className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white dark:bg-white/5 shadow-sm ring-1 ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm/6"/>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="col-span-full border-b border-gray-200 dark:border-gray-600 py-2"/>
                        <div className="col-span-full">
                            <label htmlFor="theme" className="block text-sm/6 font-medium text-gray-900 dark:text-slate-300">Theme</label>
                            <div className="mt-2">
                                <select id="theme" type="selection" name="theme" value={options.theme} onChange={e => {
                                    setOptions({
                                        ...options,
                                        theme: e.target.value
                                    });
                                }} className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 dark:text-white dark:bg-white/5 shadow-sm ring-1 ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm/6">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">Follow system</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-span-full border-b border-gray-200 dark:border-gray-600 py-2" />
                        <div className="col-span-full space-y-2">
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input id="show-sh-projects" checked={options.showOdooShProjects} onChange={e => {
                                        setOptions({
                                            ...options,
                                            showOdooShProjects: e.target.checked
                                        });
                                    }} name="show-sh-projects" type="checkbox" className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 dark:border-white/10 dark:bg-white/5 dark:focus:ring-offset-gray-800" />
                                </div>
                                <div className="ml-3 text-sm/6">
                                    <label htmlFor="show-sh-projects" className="font-medium text-gray-900 dark:text-slate-300">Show Odoo.sh projects</label>
                                </div>
                            </div>
                        </div>
                        {options.showOdooShProjects &&
                            <div className="col-span-full">
                                <button
                                    disabled={clearingShProjects}
                                    type="button"
                                    onClick={() => clearOdooShProjects()}
                                    className="w-full rounded-md bg-primary-700 px-3 py-2 text-sm text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                >
                                    {clearingShProjects ? 'Clearing...' : 'Clear Odoo.sh Projects'}
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </form>
            <div className="flex flex-col justify-center items-center mt-8">
                <p className="mb-2 dark:text-white">Made with <i className="bi bi-heart-fill text-pink-500" title="Love" /> by</p>
                <a href="https://droggol.com" target="_blank">
                    <img src="media/logo_black.svg" className="w-[70px] block dark:hidden" alt="Droggol Infotech Private Limited" />
                    <img src="media/logo_white.svg" className="w-[70px] hidden dark:block" alt="Droggol Infotech Private Limited" />
                </a>
            </div>
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<OptionsPage />);
