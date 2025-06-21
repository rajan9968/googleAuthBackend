const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter'); // note: adjust path if needed
require('dotenv').config();
require('./models/dbConnection');
const cors = require('cors');
const serverless = require('serverless-http');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server on Vercel!');
});

app.use('/auth', authRouter);

module.exports = app;
module.exports.handler = serverless(app); // ⬅️ Important for Vercel!
