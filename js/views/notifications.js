/* ==========================================
   ServicesAndroid Dashboard
   Notifications Module
========================================== */

import { db, ref, onValue, remove } from "../firebase.js";
import { CONFIG } from "../config.js";

let notificationData = [];

export function showNotifications() {

    document.getElementById("pageTitle").textContent = "Notifications";

    document.getElementById("content").innerHTML = `

        <div class="card p-4">

            <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">

                <div>

                    <h3>Notifications</h3>

                    <p class="text-muted">

                        Total Notifications :
                        <strong id="totalNotifications">0</strong>

                    </p>

                </div>

                <div style="max-width:350px;width:100%;">

                    <input
                        type="text"
                        id="searchNotification"
                        class="form-control"
                        placeholder="Search App, Title or Message">

                </div>

                <div class="mt-3">
                    <button id="deleteSelected" class="btn btn-warning me-2">Delete Selected</button>
                    <button id="deleteAll" class="btn btn-danger">Delete All</button>
                </div>

            </div>

            <div class="table-responsive">

                <table class="table table-hover table-striped align-middle">

                    <thead class="table-dark">

                        <tr>                

                            <th style="width:5%"><input type="checkbox" id="selectAll"></th>

                            <th style="width:18%">App</th>

                            <th style="width:18%">Title</th>

                            <th>Message</th>

                            <th style="width:22%">Date</th>

                        </tr>

                    </thead>

                    <tbody id="notificationTable">

                        <tr>

                            <td colspan="4" class="text-center p-5">

                                Loading Notifications...

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

    loadNotifications();

}

function loadNotifications() {

    onValue(ref(db, CONFIG.PATHS.NOTIFICATIONS), (snapshot) => {

        notificationData = [];

        if (snapshot.exists()) {

            snapshot.forEach(child => {

                notificationData.push({
                    id: child.key,
                    ...child.val()
                });

            });

            // Newest first

            notificationData.sort((a, b) => {

                return (b.timestamp || 0) - (a.timestamp || 0);

            });

        }

        document.getElementById("totalNotifications").textContent =
            notificationData.length;

        renderTable(notificationData);

    });

    document
        .getElementById("searchNotification")
        .addEventListener("input", searchNotifications);

}

function searchNotifications() {

    const keyword = document
        .getElementById("searchNotification")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderTable(notificationData);

        return;

    }

    const filtered = notificationData.filter(notification => {

        const app = (notification.appName || "").toLowerCase();

        const title = (notification.title || "").toLowerCase();

        const message = (notification.message || "").toLowerCase();

        return (
            app.includes(keyword) ||
            title.includes(keyword) ||
            message.includes(keyword)
        );

    });

    filtered.sort((a, b) => {

        return (b.timestamp || 0) - (a.timestamp || 0);

    });

    renderTable(filtered);

}

function renderTable(data) {

    const table = document.getElementById("notificationTable");

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="4" class="text-center p-5">

                    No Notifications Found

                </td>

            </tr>

        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(notification => {

        table.innerHTML += `

            <tr>

                <td><input type="checkbox" class="notificationCheck" value="${notification.id}"></td>

                <td>${notification.appName || "-"}</td>

                <td>${notification.title || "-"}</td>

                <td>${notification.message || "-"}</td>

                <td>${notification.date || "-"}</td>

            </tr>

        `;

    });

}

document.addEventListener("click", async (e) => {

    if (e.target.id === "deleteSelected") {

        const checked = document.querySelectorAll(".notificationCheck:checked");

        if (checked.length === 0) {
            alert("Select at least one Notification.");
            return;
        }

        if (!confirm(`Delete ${checked.length} selected Notification from Firebase?`))
            return;

        for (const cb of checked) {
            await remove(ref(db, CONFIG.PATHS.NOTIFICATIONS + "/" + cb.value));
        }
    }

    if (e.target.id === "deleteAll") {

        if (!confirm("Delete ALL Notifications from Firebase?"))
            return;

        await remove(ref(db, CONFIG.PATHS.NOTIFICATIONS));
    }

});

document.addEventListener("change", (e) => {

    if (e.target.id === "selectAll") {

        document.querySelectorAll(".notificationCheck").forEach(c => {
            c.checked = e.target.checked;
        });

    }

});