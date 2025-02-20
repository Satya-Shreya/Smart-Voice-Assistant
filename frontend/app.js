

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startRecording");
    const stopBtn = document.getElementById("stopRecording");
    const transcribedText = document.getElementById("transcribedText");
    const tasksList = document.getElementById("tasksList");
    const meetingDate = document.getElementById("meetingDate");
    const meetingTime = document.getElementById("meetingTime");
    const keyPointsList = document.getElementById("keyPointsList");
    const saveTranscriptionBtn = document.getElementById("saveTranscription");
    const editTasksBtn = document.getElementById("editTasks");
    const editKeyPointsBtn = document.getElementById("editKeyPoints");

    let recognition;
    let isRecording = false;
    let meetingDetails = {}; 
    let summaryId = "YOUR_SUMMARY_ID"; 

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Use Google Chrome.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        isRecording = true;
        transcribedText.innerText = "Listening...";
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        transcribedText.innerText = transcript;

        meetingDetails = extractInformation(transcript);
        saveTranscription(transcript);
    };

    recognition.onend = () => {
        isRecording = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    startBtn.addEventListener("click", () => {
        if (!isRecording) recognition.start();
    });

    stopBtn.addEventListener("click", () => {
        if (isRecording) recognition.stop();
    });

    function extractInformation(text) {
        const actionKeywords = ["assign", "complete", "send", "review", "schedule", "submit", "call", "email"];
        const dateRegex = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow|next week)\b/gi;
        const timeRegex = /(\d{1,2}:\d{2}\s?(AM|PM)?|\b\d{1,2}\s?(AM|PM)\b)/gi;

        const foundDates = text.match(dateRegex) || [];
        const foundTimes = text.match(timeRegex) || [];
        const foundTasks = text.split(" ").filter(word => actionKeywords.includes(word.toLowerCase()));

        updateUI(meetingDate, foundDates, "Not detected");
        updateUI(meetingTime, foundTimes, "Not detected");
        updateList(tasksList, foundTasks);
        updateList(keyPointsList, extractKeyPoints(text));

        return {
            meetingDate: foundDates.join(", "),
            meetingTime: foundTimes.join(", "),
            tasks: foundTasks,
            keyPoints: extractKeyPoints(text),
        };
    }

    function extractKeyPoints(text) {
        const sentences = text.split(/[.!?]/).map(sentence => sentence.trim()).filter(Boolean);
        return sentences.length > 0 ? sentences.slice(0, 3) : ["No key points detected"];
    }

    function updateUI(element, data, defaultText) {
        element.innerText = data.length > 0 ? data.join(", ") : defaultText;
    }

    function updateList(element, data) {
        element.innerHTML = "";
        data.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            element.appendChild(li);
        });
    }

    function saveTranscription(transcript) {
        fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: transcript }),
        })
        .then(response => response.json())
        .then(data => console.log("Transcription saved:", data))
        .catch(error => console.error("Error saving transcription:", error));
    }

    function editList(element, type) {
        const listItems = element.querySelectorAll("li");
        listItems.forEach((li) => {
            li.contentEditable = true;
            li.focus();
        });

        const saveBtn = document.createElement("button");
        saveBtn.innerText = "✔ Save";
        saveBtn.classList.add("save-btn");

        saveBtn.addEventListener("click", () => {
            listItems.forEach((li) => (li.contentEditable = false));

            if (type === "tasks") {
                meetingDetails.tasks = Array.from(listItems).map((li) => li.innerText);
            } else if (type === "keyPoints") {
                meetingDetails.keyPoints = Array.from(listItems).map((li) => li.innerText);
            }

            updateMeetingSummary(); // Update MongoDB
            saveBtn.remove();
        });

        element.appendChild(saveBtn);
    }

    function updateMeetingSummary() {
        fetch(`/api/summary/${summaryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tasks: meetingDetails.tasks,
                keyPoints: meetingDetails.keyPoints,
            }),
        })
        .then(response => response.json())
        .then(data => console.log("Summary updated:", data))
        .catch(error => console.error("Error updating summary:", error));
    }

    editTasksBtn.addEventListener("click", () => editList(tasksList, "tasks"));
    editKeyPointsBtn.addEventListener("click", () => editList(keyPointsList, "keyPoints"));
});
