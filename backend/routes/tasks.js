const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/", async (req, res) => {
  try {
    const { description, deadline } = req.body;
    const newTask = new Task({ description, deadline });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
