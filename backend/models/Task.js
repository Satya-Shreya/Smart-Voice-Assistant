const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String, 
    dueDate: Date, 
    status: { type: String, default: "pending" }
});

module.exports = mongoose.model('Task', TaskSchema);
