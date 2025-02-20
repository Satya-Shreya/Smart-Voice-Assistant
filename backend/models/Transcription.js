

const mongoose = require("mongoose");

const TranscriptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    extractedData: { type: Object },
    calendarEvent: { type: Object },
    meetingSummary: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transcription", TranscriptionSchema);
