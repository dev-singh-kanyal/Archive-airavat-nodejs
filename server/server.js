const express = require('express');
const app = express();
const cors = require('cors');
const cookies = require('cookie-parser')
require('dotenv').config();
const dbo = require('./db/conn');

app.use(cors({
    origin: [
        process.env.APP_ORIGIN,
        process.env.ORIGIN,
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
}));

app.use(cookies());
app.use(express.json());

app.use(require('./routes/record'));
app.use(require('./routes/users'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    dbo.connectToServer();
    console.log(`Server is running on port ${port}...`);
});