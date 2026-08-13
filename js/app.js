/* ==========================================
   ServicesAndroid Dashboard
   App Entry Point
========================================== */

import { initializeRouter } from "./router.js";

window.addEventListener("DOMContentLoaded", () => {

    console.log("=================================");
    console.log("ServicesAndroid Dashboard");
    console.log("Version 1.0.0");
    console.log("Application Started");
    console.log("=================================");

    initializeRouter();

});