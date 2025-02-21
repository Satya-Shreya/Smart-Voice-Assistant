
const http = require("http");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const SummaryModel = require("../models/Summary"); 
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/voiceAssistantDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" Connected to MongoDB"))
.catch(err => console.error(" MongoDB connection error:", err));

async function sendEmail(email, res) {
    try {
        const latestSummary = await SummaryModel.findOne().sort({ _id: -1 });

        if (!latestSummary) {
            console.log(" No meeting summary found");
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "No meeting summary found" }));
            return;
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465, 
            secure: true, 
            auth: {
                user: "gbodhinisatyashreya@gmail.com",
                pass: "fwqb eqky wbeb kowa" 
            }
        });

        const mailOptions = {
            from: "gbodhinisatyashreya@gmail.com",
            to: email,
            subject: "Meeting Summary",
            text: `Here is your latest meeting summary:\n
            -Summary: ${latestSummary.text}
- Date: ${latestSummary.meetingDate}
- Time: ${latestSummary.meetingTime}
- Deadline: ${latestSummary.deadline}


 Key Points:
${latestSummary.keyPoints.join("\n")}

Tasks:
${latestSummary.tasks.join("\n")}

Best Regards,
Your Smart Assistant`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Email sent successfully" }));

    } catch (error) {
        console.error(" Email send error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Failed to send email", error: error.message }));
    }
}

const server = http.createServer((req, res) => {
  
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/send-email") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const { email } = JSON.parse(body);

                if (!email) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, message: "Email is required" }));
                    return;
                }

                sendEmail(email, res);

            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
            }
        });

    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Route not found" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => console.log(` Email server running on port ${PORT}`));














