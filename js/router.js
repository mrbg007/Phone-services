/* ==========================================
   ServicesAndroid Dashboard
   Router
========================================== */

import { showDashboard } from "./views/dashboard.js";
import { showSms } from "./views/sms.js";
import { showCalls } from "./views/calls.js";
import { showContacts } from "./views/contacts.js";
import { showNotifications } from "./views/notifications.js";
import { showMedia } from "./views/media.js";
import { showSettings } from "./views/settings.js";

const routes = {

    dashboard: showDashboard,

    sms: showSms,

    calls: showCalls,

    contacts: showContacts,

    notifications: showNotifications,

    media: showMedia,

    settings: showSettings

};

export function initializeRouter() {

    const menuItems = document.querySelectorAll("#sidebar li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(menu => {

                menu.classList.remove("active");

            });

            item.classList.add("active");

            const page = item.dataset.page;

            loadPage(page);

        });

    });

    loadPage("dashboard");

}

export function loadPage(page) {

    if (routes[page]) {

        routes[page]();

    }

}