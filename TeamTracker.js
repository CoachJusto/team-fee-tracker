let currentDivision = "";

// Load saved data
let data = JSON.parse(localStorage.getItem("teamFees")) || {
    jrhigh: [],
    jv: [],
    varsity: [],
    lastReset: null
};

// ===============================
// AUTO RESET ON 1ST OF MONTH
// ===============================
function checkMonthlyReset() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (!data.lastReset) {
        data.lastReset = { month: currentMonth, year: currentYear };
        saveData();
        return;
    }

    if (
        data.lastReset.month !== currentMonth ||
        data.lastReset.year !== currentYear
    ) {
        // Reset all athletes to unpaid
        ["jrhigh", "jv", "varsity"].forEach(division => {
            data[division].forEach(player => {
                player.paid = false;
            });
        });

        data.lastReset = { month: currentMonth, year: currentYear };
        saveData();
    }
}

checkMonthlyReset();

// ===============================

function saveData() {
    localStorage.setItem("teamFees", JSON.stringify(data));
}

function openDivision(division) {
    currentDivision = division;
    document.getElementById("divisionScreen").classList.add("hidden");
    document.getElementById("athleteScreen").classList.remove("hidden");
    document.getElementById("divisionTitle").innerText = division.toUpperCase();
    renderAthletes();
}

function goBack() {
    document.getElementById("divisionScreen").classList.remove("hidden");
    document.getElementById("athleteScreen").classList.add("hidden");
}

function addAthlete() {
    const nameInput = document.getElementById("athleteName");
    const name = nameInput.value.trim();

    if (name === "") return;

    data[currentDivision].push({
        name: name,
        paid: false
    });

    nameInput.value = "";
    saveData();
    renderAthletes();
}

function removeAthlete(index) {
    const confirmDelete = confirm("Remove this athlete?");
    if (confirmDelete) {
        data[currentDivision].splice(index, 1);
        saveData();
        renderAthletes();
    }
}

function renderAthletes() {
    const list = document.getElementById("athleteList");
    list.innerHTML = "";

    data[currentDivision].forEach((athlete, index) => {
        const div = document.createElement("div");
        div.classList.add("athlete");

        if (athlete.paid) {
            div.classList.add("paid");
        } else {
            div.classList.add("unpaid");
        }

        div.innerText = athlete.name;

        // CLICK TO MARK PAID
        div.onclick = function () {
            if (!athlete.paid) {
                const confirmPayment = confirm("Confirm that " + athlete.name + " has paid?");
                if (confirmPayment) {
                    athlete.paid = true;
                    saveData();
                    renderAthletes();
                }
            }
        };

        // RIGHT CLICK TO REMOVE
        div.oncontextmenu = function (e) {
            e.preventDefault();
            removeAthlete(index);
        };

        list.appendChild(div);
    });
}