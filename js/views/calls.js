/* ==========================================
   ServicesAndroid Dashboard
   Calls Module
========================================== */

import { db, ref, onValue, remove } from "../firebase.js";
import { CONFIG } from "../config.js";

let callData = [];

export function showCalls() {

    document.getElementById("pageTitle").textContent = "Calls";

    document.getElementById("content").innerHTML = `

        <div class="card p-4">

            <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">

                <div>

                    <h3>Calls</h3>

                    <p class="text-muted">

                        Total Calls :
                        <strong id="totalCalls">0</strong>

                    </p>

                </div>

                <div style="max-width:350px;width:100%;">

                    <input
                        type="text"
                        id="searchCall"
                        class="form-control"
                        placeholder="Search Name, Number or Type">

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

                            <th>Name</th>

                            <th>Number</th>

                            <th>Type</th>

                            <th>Duration</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody id="callTable">

                        <tr>

                            <td colspan="6" class="text-center p-5">

                                Loading Calls...

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

    loadCalls();

}

function loadCalls() {

    onValue(ref(db, CONFIG.PATHS.CALLS), (snapshot) => {

        callData = [];

        if (snapshot.exists()) {

            snapshot.forEach(child => {

                callData.push({
                    id: child.key,
                    ...child.val()
                });

            });

            // Newest calls first

            callData.sort((a, b) => {

                return (b.timestamp || 0) - (a.timestamp || 0);

            });

        }

        document.getElementById("totalCalls").textContent =
            callData.length;

        renderTable(callData);

    });

    document
        .getElementById("searchCall")
        .addEventListener("input", searchCalls);

}

function searchCalls() {

    const keyword = document
        .getElementById("searchCall")
        .value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderTable(callData);

        return;

    }

    const filtered = callData.filter(call => {

        const name = (call.name || "").toLowerCase();

        const number = (call.number || "").toLowerCase();

        const type = (call.type || "").toLowerCase();

        return (
            name.includes(keyword) ||
            number.includes(keyword) ||
            type.includes(keyword)
        );

    });

    renderTable(filtered);

}

function renderTable(data) {

    const table = document.getElementById("callTable");

    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6" class="text-center p-5">

                    No Calls Found

                </td>

            </tr>

        `;

        return;

    }

    table.innerHTML = "";

    data.forEach(call => {

        table.innerHTML += `

            <tr>

                <td><input type="checkbox" class="callCheck" value="${call.id}"></td>

                <td>${call.name || "Unknown"}</td>

                <td>${call.number || "-"}</td>

                <td>${call.type || "-"}</td>

                <td>${call.duration || "00:00"}</td>

                <td>${call.date || "-"}</td>

            </tr>

        `;

    });

}

document.addEventListener("click", async (e) => {

    if (e.target.id === "deleteSelected") {
        const checked=document.querySelectorAll(".callCheck:checked");
        if(checked.length===0){alert("Select at least one Call.");return;}
        if(!confirm(`Delete ${checked.length} selected calls from Firebase?`)) return;
        for(const cb of checked){
            await remove(ref(db, CONFIG.PATHS.CALLS + "/" + cb.value));
        }
    }

    if (e.target.id==="deleteAll"){
        if(!confirm("Delete ALL Calls from Firebase?")) return;
        await remove(ref(db, CONFIG.PATHS.CALLS));
    }

});

document.addEventListener("change",(e)=>{
    if(e.target.id==="selectAll"){
        document.querySelectorAll(".callCheck").forEach(c=>c.checked=e.target.checked);
    }
});
