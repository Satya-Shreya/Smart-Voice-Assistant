// const express = require("express");
// const nodemailer = require("nodemailer");

// const router = express.Router();

// // Email sending function
// // async function testSMTPConnection() {
// //     let transporter = nodemailer.createTransport({
// //         service: "gmail",
// //         auth: {
// //             user: process.env.EMAIL_USER,
// //             pass: process.env.EMAIL_PASS,
// //         },
        
// //     });

// //     transporter.verify((error, success) => {
// //         if (error) {
// //             console.error("❌ SMTP Connection Error:", error);
// //         } else {
// //             console.log("✅ SMTP Connection Successful.");
// //         }
// //     });
// // }
// // testSMTPConnection();
// async function sendEmail(summary, recipientEmail) {
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER, // Store in .env
//             pass: process.env.EMAIL_PASS, // Store in .env
//         },
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//     });

//     let mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: recipientEmail,
//         subject: "Meeting Summary",
//         text: summary,
//     };

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log("✅ Email sent:", info.response);
//         return "Email sent successfully.";
//     } catch (error) {
//         console.error("❌ Error sending email:", error);
//         throw new Error("Failed to send email.");
//     }
// }

// // API Route for Sending Emails
// router.post("/", async (req, res) => {
//     const { email, summary } = req.body;
//     if (!email || !summary) {
//         return res.status(400).json({ message: "Email and summary are required." });
//     }

//     try {
//         const response = await sendEmail(summary, email);
//         res.json({ message: response });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;



const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Configure mail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Handle email sending
router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Meeting Summary",
        text: "This is your meeting summary. Please check the details.",
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

module.exports = router;
