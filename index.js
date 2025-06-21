const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRouter');
require('dotenv').config();
require('./models/dbConnection');

const serverless = require('serverless-http'); // <-- Required for Vercel

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.use('/auth', authRouter);

module.exports = serverless(app);
