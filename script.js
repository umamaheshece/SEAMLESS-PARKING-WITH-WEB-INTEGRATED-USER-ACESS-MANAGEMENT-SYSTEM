document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!");

    // ✅ Sidebar Menu Navigation
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            let sectionId = this.getAttribute("onclick").match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    // ✅ Function to show/hide sections
    function showSection(sectionId) {
        document.querySelectorAll(".section").forEach(section => {
            section.style.display = "none";
        });
        document.getElementById(sectionId).style.display = "block";
    }

    // ✅ Show Welcome Page by Default
    showSection("welcome");

    // ✅ Registration Form Submission
    let registrationForm = document.getElementById("registrationForm");
    let showDetailsButton = document.createElement("button");
    showDetailsButton.textContent = "Show User Details";
    showDetailsButton.style.display = "none";
    showDetailsButton.addEventListener("click", function () {
        let newPage = window.open("", "_blank");
        newPage.document.write(detailsPageContent);
        newPage.document.close();
    });
    document.getElementById("registration").appendChild(showDetailsButton);

    let detailsPageContent = "";

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let rfid = document.getElementById("rfid").value;
            let vehicle = document.getElementById("vehicle").value;
            let slot = document.getElementById("slot").value;

            if (!name || !rfid || !vehicle || !slot) {
                alert("Please fill in all fields.");
                return;
            }

            let formData = { name, rfid, vehicle, slot };
            console.log("Registering User:", formData);

            // ✅ Store in Entry & Exit Logs
            let logsTable = document.getElementById("logsTable");
            if (logsTable) {
                let newRow = logsTable.insertRow();
                newRow.innerHTML = `
                    <td>${rfid}</td>
                    <td>${vehicle}</td>
                    <td>${new Date().toLocaleString()}</td>
                    <td>Entry</td>
                `;
            }

            // ✅ Change Slot Color to Red
            let selectedSlot = document.querySelector(`#slotsContainer .slot[data-slot='${slot.split(' ')[1]}']`);
            if (selectedSlot) {
                selectedSlot.style.backgroundColor = "red";
                selectedSlot.textContent = `${slot} (Occupied)`;
            }

            // ✅ Store Registration Details for New Page
            detailsPageContent = `
                <html>
                <head>
                    <title>Registration Details</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2 align="center">📝 Registered User Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>RFID Tag</th>
                                <th>Vehicle Number</th>
                                <th>Parking Slot</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${name}</td>
                                <td>${rfid}</td>
                                <td>${vehicle}</td>
                                <td>${slot}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                </body>
                </html>
            `;

            showDetailsButton.style.display = "block";
            alert("✅ Registration Successful!");
            registrationForm.reset();
        });
    }
});
