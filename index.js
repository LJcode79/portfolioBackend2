const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: 'https://lawrencejohn.netlify.app',
  methods: ['POST', 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Email transporter configuration
const contactEmail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.REACT_APP_EMAIL,
    pass: process.env.REACT_APP_EMAILPASSWORD,
  }
});

// Verify email configuration
contactEmail.verify((error) => {
  if (error) {
    console.error('Email config error:', error);
  } else {
    console.log('Email service ready');
  }
});

// Contact endpoint
app.post('/contact', (req, res) => {
  console.log('Received contact request:', req.body);

  const { firstName, lastName, email, message, phone } = req.body;
  const name = `${firstName} ${lastName}`;

  const mail = {
    from: name,
    to: process.env.REACT_APP_EMAIL,
    subject: 'Contact Form Submission - Portfolio',
    html: `
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Message: ${message}</p>
    `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error('Send error:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.json({ status: 'Message Sent' });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(5000, () => console.log("Server Running"));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET  http://localhost:${PORT}/health`);
  console.log(`- POST http://localhost:${PORT}/contact`);
});