const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:serverLog');
const auth = require('./routes/auth/combinedRoute');
require('dotenv').config();
const app = express();

/* eslint-disable no-undef */
const PORT = process.env.PORT || 3001;
/* eslint-enable no-undef */


app.use(express.json());
app.use(helmet());
app.use('/auth/', auth);

/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}
/* eslint-enable no-undef */

app.listen(PORT, () => debug(`listening on port ${PORT}`));