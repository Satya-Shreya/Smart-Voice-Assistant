// const express = require("express");
// const router = express.Router();
// const Summary = require("../models/Summary");

// // Get all summaries
// router.get("/", async (req, res) => {
//     try {
//         const summaries = await Summary.find();
//         res.json(summaries);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching summaries" });
//     }
// });

// // Get a single summary by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const summary = await Summary.findById(req.params.id);
//         if (!summary) {
//             return res.status(404).json({ message: "Summary not found" });
//         }
//         res.json(summary);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching summary" });
//     }
// });

// // Add a new summary
// router.post("/", async (req, res) => {
//     try {
//         const newSummary = new Summary({
//             text: req.body.text
//         });
//         await newSummary.save();
//         res.status(201).json(newSummary);
//     } catch (error) {
//         res.status(500).json({ message: "Error saving summary" });
//     }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Summary = require("../models/Summary");

// // Get all summaries
// router.get("/", async (req, res) => {
//     try {
//         const summaries = await Summary.find();
//         res.json(summaries);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching summaries" });
//     }
// });

// // Get a single summary by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const summary = await Summary.findById(req.params.id);
//         if (!summary) {
//             return res.status(404).json({ message: "Summary not found" });
//         }
//         res.json(summary);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching summary" });
//     }
// });

// // Add a new summary
// router.post("/", async (req, res) => {
//     if (!req.body.text || req.body.text.trim() === "") {
//         return res.status(400).json({ message: "Summary text is required." });
//     }

//     try {
//         const newSummary = new Summary({ text: req.body.text });
//         await newSummary.save();
//         res.status(201).json(newSummary);
//     } catch (error) {
//         res.status(500).json({ message: "Error saving summary" });
//     }
// });

// module.exports = router;


// const express = require("express");
// const SummaryModel = require("../models/Summary");

// const router = express.Router();

// // Update an existing summary by ID
// router.put("/:id", async (req, res) => {
//     try {
//         const { text, meetingDate, meetingTime, deadline, tasks, keyPoints } = req.body;

//         const updatedSummary = await SummaryModel.findByIdAndUpdate(
//             req.params.id,
//             { text, meetingDate, meetingTime, deadline, tasks, keyPoints },
//             { new: true }
//         );

//         if (!updatedSummary) {
//             return res.status(404).json({ error: "Summary not found" });
//         }

//         res.json(updatedSummary);
//     } catch (err) {
//         console.error("Error updating summary:", err);
//         res.status(500).json({ error: "Failed to update summary." });
//     }
// });

// module.exports = router;



const express = require("express");
const SummaryModel = require("../models/Summary");

const router = express.Router();

// Update an existing summary by ID
router.put("/:id", async (req, res) => {
    try {
        const { tasks, keyPoints } = req.body;

        const updatedSummary = await SummaryModel.findByIdAndUpdate(
            req.params.id,
            { tasks, keyPoints },
            { new: true }
        );

        if (!updatedSummary) {
            return res.status(404).json({ error: "Summary not found" });
        }

        res.json(updatedSummary);
    } catch (err) {
        console.error("Error updating summary:", err);
        res.status(500).json({ error: "Failed to update summary." });
    }
});

module.exports = router;
