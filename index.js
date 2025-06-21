const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const authRouter = require('./routes/authRouter');
require('dotenv').config();
require('./models/dbConnection');
const cors = require('cors');
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
})

// app.use(cors());

app.use(cors({
    origin: 'https://google-auth-alpha.vercel.app',
    methods: ['GET', 'POST'], // Add PUT, DELETE if needed
    credentials: true, // If you're using cookies or sessions
}));

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})