const express = require("express");
const { sendContactFormEmails } = require("../utils/mailer");

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact query and send confirmation emails
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await sendContactFormEmails({ name, email, subject, message });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Server error sending email" });
  }
});

module.exports = router;
