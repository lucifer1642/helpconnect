import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create a reusable transporter using actual credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    let info = await transporter.sendMail({
      from: `"HelpConnect Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to HelpConnect Updates!",
      text: "Thank you for subscribing to our newsletter. We'll keep you updated on the latest donation camps and emergencies.",
      html: "<b>Thank you for subscribing to our newsletter!</b><br/>We'll keep you updated on the latest donation camps and emergencies.",
    });
    
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ error: 'Failed to process subscription', details: error?.message || String(error) });
  }
});

// Simple health check endpoint
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
