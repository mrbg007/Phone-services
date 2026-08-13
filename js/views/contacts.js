/* ==========================================
   ServicesAndroid Dashboard
   Contacts Module
========================================== */

import { db, ref, onValue } from "../firebase.js";
import { CONFIG } from "../config.js";

let contactData = [];

export function showContacts() {

    document.getElementById("pageTitle").textContent = "Contacts";

    document.getElementById("content").innerHTML = `

        <div class="card p-4">

            <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">

                <div>

                    <h3>Contacts</h3>

                    <p class="text-muted">

                        Total Contacts :
                        <strong id="totalContacts">0</strong>

                    </p>

                </div>

                <div style="max-width:350px;width:100%;">

                    <input
                        type="text"
                        id="searchContact"
                        class="form-control"
                        placeholder="Search Name or Number">

                </div>

            </div>

            <div class="table-responsive">

                <table class="table table-hover table-striped align-middle">

                    <thead class="table-dark">

                        <tr>

                            <th style="width:10%">ID</th>

                            <th style="width:35%">Name</th>

                            <th>Number</th>

                            <th style="width:22%">Last Updated</th>

                        </tr>

                    </thead>

                    <tbody id="contactTable">

                        <tr>

                            <td colspan="4" class="text-center p-5">

                                Loading Contacts...

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

    loadContacts();

}

function loadContacts() {

    onValue(ref(db, CONFIG.PATHS.CONTACTS), (snapshot) => {

        contactData = [];

        if (snapshot.exists()) {

            snapshot.forEach(child => {

                contactData.push(child.val());

            });

            // Show recently added/updated contacts first
            contactData.sort((a, b) => {

                return (b.lastUpdated || 0) - (a.lastUpdated || 0);

            });

        }

        document.getElementById("totalContacts").textContent =
            contactData.length;

        renderTable(contactData);

    });

    document
        .getElementById("searchContact")
        .addEventListener("input", searchContacts);

}

function searchContacts() {

    const keyword = document
        .getElementById("searchContact")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderTable(contactData);

        return;

    }

    const filtered = contactData.filter(contact => {

        const name = (contact.name || "").toLowerCase();

        const number = (contact.number || "").toLowerCase();

        return (
            name.includes(keyword) ||
            number.includes(keyword)
        );

    });

    renderTable(filtered);

}

function renderTable(data) {

    const table = document.getElementById("contactTable");

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="4" class="text-center p-5">

                    No Contacts Found

                </td>

            </tr>

        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(contact => {

        let lastUpdated = "-";

        if (contact.lastUpdated) {

            lastUpdated = new Date(contact.lastUpdated)
                .toLocaleString();

        }

        table.innerHTML += `

            <tr>

                <td>${contact.contactId ?? "-"}</td>

                <td>${contact.name || "Unknown"}</td>

                <td>${contact.number || "-"}</td>

                <td>${lastUpdated}</td>

            </tr>

        `;

    });

}