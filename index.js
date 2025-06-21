const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter');
require('dotenv').config();
require('./models/dbConnection');
const cors = require('cors');
const serverless = require('serverless-http'); // <-- ADD THIS

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.use('/auth', authRouter);

// No app.listen() for Vercel
module.exports = serverless(app); // <-- EXPORT like this
