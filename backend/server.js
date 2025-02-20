

require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const transcribeRoutes = require("./routes/transcribe");
const taskRoutes = require("./routes/tasks");
const emailRoutes = require("./routes/email");
const summaryRoutes = require("./routes/summary");
const SummaryModel = require("./models/Summary");
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/getSummaries", async (req, res) => {
    try {
        const summaries = await SummaryModel.find(); // Adjust this based on your DB setup
        res.json(summaries);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve summaries." });
    }
});
app.post("/api/transcribe", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        const newSummary = new SummaryModel({
            text,
            meetingDate: "N/A",
            meetingTime: "N/A",
            deadline: "N/A",
            tasks: [],
            keyPoints: []
        });

        await newSummary.save(); 
        console.log("Summary saved:", newSummary);

        res.json({ message: "Transcription saved successfully", summary: newSummary });
    } catch (error) {
        console.error("Error saving transcription:", error);
        res.status(500).json({ error: "Failed to save transcription." });
    }
});
//app.use("/api/transcribe", transcribeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/send-email", emailRoutes);
app.use("/api/summaries", summaryRoutes);

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded Successfully" : "Not Set");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
