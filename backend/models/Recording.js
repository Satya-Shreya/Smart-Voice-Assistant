 const mongoose = require("mongoose");


const RecordingSchema = new mongoose.Schema({
    transcript: { type: String, required: true, unique: true }, // This will cause duplicates to fail
    createdAt: { type: Date, default: Date.now },
    recordingId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }
});


module.exports = mongoose.model("Recording", RecordingSchema);