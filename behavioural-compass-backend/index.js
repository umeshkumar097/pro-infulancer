const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 5001; // Changed to 5001 to avoid EADDRINUSE on 5000

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8KsaqEOjoC4h@ep-solitary-truth-adbb3fen.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to PostgreSQL database');
  
  // Create table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_details (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      age INT,
      experience INT,
      industry VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      reasoning INT,
      visionary INT,
      leverage INT,
      assertiveness INT,
      friendly_persuasion INT,
      bargaining INT
    );
  `;
  client.query(createTableQuery, (err) => {
    release();
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table "user_details" is ready');
    }
  });
});

// Endpoint to insert user data
app.post('/api/user', async (req, res) => {
  const { firstName, lastName, age, experience, industry, email, phone } = req.body;

  const userQuery = 'INSERT INTO user_details (first_name, last_name, age, experience, industry, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
  const userValues = [firstName, lastName, age, experience, industry, email, phone];

  try {
    const result = await pool.query(userQuery, userValues);
    const userId = result.rows[0].id;
    res.status(200).send({ message: 'User data inserted successfully', userId });
  } catch (err) {
    console.error('Error inserting user data:', err);
    res.status(500).send({ error: 'Failed to insert user data' });
  }
});

// Endpoint to insert scores
app.post('/api/scores', async (req, res) => {
  const { userId, scores } = req.body;

  if (!scores || typeof scores !== 'object') {
    res.status(400).send({ error: 'Invalid scores data' });
    return;
  }

  const updateQuery = `
  UPDATE user_details 
  SET reasoning = $1, visionary = $2, leverage = $3, assertiveness = $4, friendly_persuasion = $5, bargaining = $6
  WHERE id = $7`;

  const updateValues = [scores.R, scores.V, scores.L, scores.A, scores.FP, scores.B, userId];

  try {
    await pool.query(updateQuery, updateValues);
    res.status(200).send({ message: 'Scores inserted successfully' });
  } catch (err) {
    console.error('Error updating scores:', err);
    res.status(500).send({ error: 'Failed to update scores' });
  }
});

// Endpoint to send email with PDF attachment
app.post('/api/send-email', async (req, res) => {
  const { userId, pdfBase64 } = req.body;

  if (!userId || !pdfBase64) {
    return res.status(400).send({ error: 'Missing userId or pdf data' });
  }

  try {
    const userQuery = 'SELECT first_name, last_name, email FROM user_details WHERE id = $1';
    const result = await pool.query(userQuery, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Safely strip any Data URI prefix (e.g. data:application/pdf;base64, or data:application/pdf;filename=generated.pdf;base64,)
    const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;

    const mailOptions = {
      from: `"Behavioural Compass" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Behavioural Compass Results',
      html: `
        <h2>Hi ${user.first_name} ${user.last_name},</h2>
        <p>Thank you for completing the Behavioural Compass questionnaire.</p>
        <p>Attached is a PDF copy of your results, exactly as you saw them on the web.</p>
        <br />
        <p>Best Regards,</p>
        <p>The Behavioural Compass Team</p>
      `,
      attachments: [
        {
          filename: 'Behavioural_Compass_Result.pdf',
          content: base64Data,
          encoding: 'base64'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send({ error: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
