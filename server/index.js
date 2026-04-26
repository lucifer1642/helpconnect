import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

// Create a reusable transporter using a test account (Ethereal)
let testAccountPromise = nodemailer.createTestAccount();
let transporterPromise = testAccountPromise.then(account => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const transporter = await transporterPromise;
    let info = await transporter.sendMail({
      from: '"HelpConnect Admin" <admin@helpconnect.in>',
      to: email,
      subject: "Welcome to HelpConnect Updates!",
      text: "Thank you for subscribing to our newsletter. We'll keep you updated on the latest donation camps and emergencies.",
      html: "<b>Thank you for subscribing to our newsletter!</b><br/>We'll keep you updated on the latest donation camps and emergencies.",
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: 'Subscribed successfully', previewUrl: nodemailer.getTestMessageUrl(info) });
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
