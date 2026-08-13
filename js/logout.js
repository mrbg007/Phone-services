/* ==========================================
   ServicesAndroid Dashboard
   Logout
========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const logout = confirm(
            "Are you sure you want to logout?"
        );

        if (!logout) return;

        sessionStorage.removeItem("loggedIn");

        window.location.href = "login.html";

    });

}