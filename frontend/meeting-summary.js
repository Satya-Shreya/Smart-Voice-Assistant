async function fetchMeetingSummary() {
    try {
        let response = await fetch("/api/summaries");
        let summaries = await response.json();
        
        let summaryContainer = document.getElementById("meeting-summary");
        summaryContainer.innerHTML = "";

        summaries.forEach((summary) => {
            let div = document.createElement("div");
            div.className = "summary-item";
            div.innerHTML = `
                <h3>Meeting Summary</h3>
                <p><strong>Date:</strong> ${summary.meetingDate || "N/A"}</p>
                <p><strong>Time:</strong> ${summary.meetingTime || "N/A"}</p>
                <p><strong>Deadline:</strong> ${summary.deadline || "N/A"}</p>
                <p><strong>Tasks:</strong> ${summary.tasks?.join(", ") || "No tasks detected"}</p>
                <p><strong>Key Points:</strong> ${summary.keyPoints?.join(", ") || "No key points detected"}</p>
            `;
            summaryContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching meeting summary:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchMeetingSummary);
