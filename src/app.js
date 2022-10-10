const express = require('express');
const volleyball = require('volleyball');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
require("./config/db");
require('./config/passport');

const app = express();
const apiRouter = require('./routes/apiRouter');

app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: '*' }));

app.use('/api/v1', apiRouter);

module.exports = app;