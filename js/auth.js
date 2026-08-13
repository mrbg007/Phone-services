/* ==========================================
   ServicesAndroid Dashboard
   Authentication
========================================== */

const loggedIn = sessionStorage.getItem("loggedIn");

if (loggedIn !== "true") {

    window.location.replace("login.html");

}