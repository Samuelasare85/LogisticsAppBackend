const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('app:serverLog');
const {auth, send_package} = require('./routes/combinedRoute');
require('dotenv').config();
const app = express();

/* eslint-disable no-undef */
const PORT = process.env.PORT || 3001;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
/* eslint-enable no-undef */

morgan.token('type', function (req, res) { return req.headers['content-type'];});

app.use(express.json());
app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[web] :type', {stream: accessLogStream}));
app.use('/auth', auth);
app.use('/package', send_package);

/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}
/* eslint-enable no-undef */

app.listen(PORT, () => debug(`listening on port ${PORT}`));
