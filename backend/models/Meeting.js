const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    date: Date,
    time: String,
    participants: [String],
    summary: String
});

module.exports = mongoose.model('Meeting', MeetingSchema);
