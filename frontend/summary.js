// document.getElementById("summaryButton").addEventListener("click", async () => {
//     const summaryContent = document.getElementById("summaryContent");
    
//     // Show loading message
//     summaryContent.innerHTML = "<p>Loading summaries...</p>";

//     try {
//         const response = await fetch("http://localhost:3000/getSummaries");
        
//         if (!response.ok) {
//             throw new Error("Failed to fetch summaries.");
//         }

//         const summaries = await response.json();

//         if (summaries.length === 0) {
//             summaryContent.innerHTML = "<p>No summaries available.</p>";
//             return;
//         }

//         let summaryHTML = summaries.map(summary => `
//             <div class="summary-item">
//                 <p><strong>Summary ID:</strong> ${summary.id}</p>
//                 <p>${summary.text}</p>
//                 <button onclick="fetchSingleSummary(${summary.id})">View Details</button>
//                 <hr>
//             </div>
//         `).join("");

//         summaryContent.innerHTML = summaryHTML;
//     } catch (error) {
//         console.error("Error fetching summaries:", error);
//         summaryContent.innerHTML = "<p>Failed to load summaries.</p>";
//     }
// });

// // Function to fetch a single summary
// async function fetchSingleSummary(id) {
//     try {
//         const response = await fetch(`http://localhost:3000/getSummary/${id}`);
        
//         if (!response.ok) {
//             throw new Error("Failed to fetch summary.");
//         }

//         const summary = await response.json();

//         alert(`Meeting Summary:\n\n${summary.text}`);
//     } catch (error) {
//         console.error("Error fetching summary:", error);
//         alert("Failed to fetch summary.");
//     }
// }



async function fetchMeetingSummary() {
    try {
        const response = await fetch("http://localhost:3000/getSummaries");

        if (!response.ok) throw new Error("Failed to fetch summaries.");

        const summaries = await response.json();

        if (summaries.length === 0) {
            document.getElementById("summaryContent").innerText = "No summary available.";
            return;
        }

        const latestSummary = summaries[summaries.length - 1];

        document.getElementById("meetingDate").innerText = latestSummary.meetingDate || "Not detected";
        document.getElementById("meetingTime").innerText = latestSummary.meetingTime || "Not detected";
        document.getElementById("deadline").innerText = latestSummary.deadline || "Not detected";

        updateList("tasksList", latestSummary.tasks);
        updateList("keyPointsList", latestSummary.keyPoints);

        document.getElementById("summaryButton").addEventListener("click", () => {
            document.getElementById("summaryContent").innerText = latestSummary.text || "No summary available.";
        });

    } catch (error) {
        console.error("Error fetching summary:", error);
        document.getElementById("summaryContent").innerText = "Failed to load summary.";
    }
}

function updateList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = items.length > 0 ? items.map(item => `<li>${item}</li>`).join("") : "<li>No data available.</li>";
}

fetchMeetingSummary();
