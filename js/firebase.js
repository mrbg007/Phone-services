/* ==========================================
   ServicesAndroid Dashboard
   Firebase
========================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    get,
    set,
    push,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";

import { CONFIG } from "./config.js";

/* Initialize Firebase */

const app = initializeApp(CONFIG.FIREBASE);

/* Realtime Database */

const db = getDatabase(app);

/* Export Everything */

export {
    db,
    ref,
    onValue,
    get,
    set,
    push,
    update,
    remove
};