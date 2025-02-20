// const nlp = require('compromise'); // Install with: npm install compromise

// const extractActions = (text) => {
//     let tasks = [];
//     let keyPoints = [];
//     let date = null;
//     let time = null;

//     // Extract tasks (e.g., "We need to send an email")
//     const taskRegex = /(need to|should|must|remember to|ensure to) ([a-zA-Z ]+)/gi;
//     let taskMatches = text.match(taskRegex);
//     if (taskMatches) {
//         tasks = taskMatches.map(task => task.replace(/(need to|should|must|remember to|ensure to)/gi, "").trim());
//     }

//     // Extract dates (e.g., "next Monday", "on March 5th")
//     let doc = nlp(text);
//     let foundDates = doc.dates().out('array');
//     if (foundDates.length > 0) date = foundDates[0];

//     // Extract times (e.g., "at 3 PM", "by 10:30 AM")
//     const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?\b/g;
//     let timeMatches = text.match(timeRegex);
//     if (timeMatches) time = timeMatches[0];

//     // Extract key points (every sentence containing 'important', 'note', 'highlight')
//     const keyPointRegex = /\b(important|note that|highlight|remember)\b.*?\./gi;
//     let keyPointMatches = text.match(keyPointRegex);
//     if (keyPointMatches) {
//         keyPoints = keyPointMatches.map(point => point.trim());
//     }

//     return { tasks, date, time, keyPoints };
// };

// module.exports = extractActions;

// const nlp = require('compromise');

// const extractActions = (text) => {
//     let tasks = [];
//     let keyPoints = [];
//     let date = null;
//     let time = null;

//     const taskRegex = /(need to|should|must|remember to|ensure to) ([a-zA-Z ]+)/gi;
//     let taskMatches = text.match(taskRegex);
//     if (taskMatches) {
//         tasks = taskMatches.map(task => task.replace(/(need to|should|must|remember to|ensure to)/gi, "").trim());
//     }

//     let doc = nlp(text);
//     let foundDates = doc.dates().out('array');
//     if (foundDates.length > 0) {
//         date = foundDates[0];
//     }

//     const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?\b/g;
//     let timeMatches = text.match(timeRegex);
//     if (timeMatches) {
//         time = timeMatches[0];
//     }

//     if (!date) {
//         let now = new Date();
//         date = now.toISOString().split('T')[0];
//     }

//     if (!time) {
//         let now = new Date();
//         time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//     }

//     const keyPhrases = ["important", "note that", "highlight", "remember"];
//     let sentences = text.match(/[^.!?]+[.!?]/g) || [];

//     keyPoints = sentences.filter(sentence =>
//         keyPhrases.some(phrase => sentence.toLowerCase().includes(phrase))
//     );

//     return { tasks, date, time, keyPoints };
// };

// // Example usage (this part demonstrates how to use the function and display the results):
// const text = "We need to send an email. Remember to call John. It is important to finalize the report. Note that the deadline is tomorrow. Highlight the key findings.  This is another sentence.";
// const extractedData = extractActions(text);

// console.log("Tasks:", extractedData.tasks);
// console.log("Date:", extractedData.date);
// console.log("Time:", extractedData.time);
// console.log("Key Points:");

// extractedData.keyPoints.forEach(point => {
//     console.log(`- ${point.trim()}`);
// });


// //  If you want all key points on one line:
// // console.log("Key Points (one line):", extractedData.keyPoints.join(" "));


// module.exports = extractActions; // Make the function available for other modules




const nlp = require('compromise');

const extractActions = (text) => {
    let tasks = [];
    let keyPoints = [];
    let date = null;
    let time = null;

    const taskRegex = /(need to|should|must|remember to|ensure to|plan to|schedule|finalize) ([a-zA-Z ]+)/gi;
    let taskMatches = text.match(taskRegex);
    if (taskMatches) {
        tasks = taskMatches.map(task => task.replace(/(need to|should|must|remember to|ensure to|plan to|schedule|finalize)/gi, "").trim());
    }

    let doc = nlp(text);
    let foundDates = doc.dates().out('array');
    if (foundDates.length > 0) {
        date = foundDates[0];
    }

    const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?\b/g;
    let timeMatches = text.match(timeRegex);
    if (timeMatches) {
        time = timeMatches[0];
    }

    if (!date) {
        let now = new Date();
        date = now.toISOString().split('T')[0];
    }

    if (!time) {
        let now = new Date();
        time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    const keyPhrases = ["important", "note that", "highlight", "remember"];
    let sentences = text.match(/[^.!?]+[.!?]/g) || [];

    keyPoints = sentences.filter(sentence =>
        keyPhrases.some(phrase => sentence.toLowerCase().includes(phrase))
    );

    return { tasks, date, time, keyPoints };
};

module.exports = extractActions;
