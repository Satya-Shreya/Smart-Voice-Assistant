
const express = require("express");
const fs = require("fs");
const { transcribeAudio } = require("../utils/speechProcessing");
const Recording = require("../models/Recording");

const router = express.Router();

router.post("/transcribe", async (req, res) => {
    try {
        console.log("Received request for transcription...");

        const { audio } = req.body; 

        if (!audio) {
            console.log("❌ No audio data received.");
            return res.status(400).json({ error: "No audio data received." });
        }

        const audioBuffer = Buffer.from(audio, "base64");

        const transcription = await transcribeAudio(audioBuffer);
        console.log("Transcribed Text:", transcription);

        if (!transcription) {
            return res.status(500).json({ error: "Transcription failed. Try speaking clearly." });
        }

        const newRecording = new Recording({
            transcript: transcription,
            audioData: audioBuffer 
        });

        await newRecording.save();
        console.log("✅ Recording saved to database.");

        res.json({ transcript: transcription });

    } catch (error) {
        console.error("Transcription API Error:", error);
        res.status(500).json({ error: "Internal server error during transcription." });
    }
});

module.exports = router;
