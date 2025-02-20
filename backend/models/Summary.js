const mongoose = require("mongoose");

const SummarySchema = new mongoose.Schema({
    text: { type: String, required: true },
    meetingDate: { type: String, default: "N/A" },
    meetingTime: { type: String, default: "N/A" },
    deadline: { type: String, default: "N/A" },
    tasks: { type: [String], default: [] },
    keyPoints: { type: [String], default: [] }
});

const SummaryModel = mongoose.model("Summary", SummarySchema);
module.exports = SummaryModel;
