

const keywordExtractor = require("keyword-extractor");
const nodemailer = require("nodemailer");

function transcribeAudio(audioPath) {
    
    return "Meeting on March 10 at 3 PM about project updates. Finish report by March 12.";
}

function extractActionItems(text) {
    let meetingDate = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December) \d+/i);
    let meetingTime = text.match(/\d{1,2}(:\d{2})?\s?(AM|PM)/i);
    let deadline = text.match(/(?:by|before|due on) (January|February|March|April|May|June|July|August|September|October|November|December) \d+/i);
    let keyPoints = keywordExtractor.extract(text, { language: "english", remove_digits: true });

    return {
        meetingDate: meetingDate ? meetingDate[0] : "Not detected",
        meetingTime: meetingTime ? meetingTime[0] : "Not detected",
        deadline: deadline ? deadline[0].replace(/by |before |due on /, "") : "Not detected",
        keyPoints,
    };
}

function createCalendarEvent(meetingDetails) {
    if (meetingDetails.meetingDate === "Not detected") return "No valid date found.";
    
    let time = meetingDetails.meetingTime !== "Not detected" ? meetingDetails.meetingTime : "10:00 AM";
    
    const event = {
        summary: "Meeting",
        start: new Date(`${meetingDetails.meetingDate} ${time}`),
        end: new Date(`${meetingDetails.meetingDate} ${time}`),
        description: "Automatically created meeting event.",
    };

    return event;
}

function generateSummary(meetingDetails) {
    return `Meeting Summary:
    - Date: ${meetingDetails.meetingDate}
    - Time: ${meetingDetails.meetingTime}
    - Deadline: ${meetingDetails.deadline}
    - Key Points: ${meetingDetails.keyPoints.join(", ")}`;
}

async function sendEmail(summary, recipientEmail) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: "Meeting Summary",
        text: summary,
    };

    try {
        await transporter.sendMail(mailOptions);
        return "Email sent successfully.";
    } catch (error) {
        return `Error sending email: ${error.message}`;
    }
}

module.exports = { transcribeAudio, extractActionItems, createCalendarEvent, generateSummary, sendEmail };
