import { db, ref, get } from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", login);

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        login();
    }
});

async function login() {

    error.textContent = "";

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (username === "" || password === "") {

        error.textContent = "Please enter username and password.";

        return;
    }

    try {

        const snapshot = await get(
            ref(db, "PhoneMonitor/login")
        );

        if (!snapshot.exists()) {

            error.textContent = "Login information not found.";

            return;
        }

        const loginData = snapshot.val();

        if (
            username === loginData.username &&
            password === loginData.password
        ) {

            sessionStorage.setItem("loggedIn", "true");

            window.location.href = "index.html";

        } else {

            error.textContent = "Invalid username or password.";

        }

    } catch (e) {

        console.error(e);

        error.textContent = "Unable to connect to Firebase.";

    }

}