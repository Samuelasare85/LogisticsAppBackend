const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const {auth, send_package, payment} = require('./routes/combinedRoute');
const app = express();
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
require('dotenv').config();

/* eslint-disable no-undef */
const PORT = process.env.PORT || 3001;

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : (process.env.NODE_ENV === 'development' ? 0.5 : 0),
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : (process.env.NODE_ENV === 'development' ? 0.5 : 0)
  });
  

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
/* eslint-enable no-undef */

morgan.token('type', function (req, res) { return req.headers['content-type'];});

app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(cors({'credentials': true}));
app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[web] :type', {stream: accessLogStream}));
app.use('/auth', auth);
app.use('/package', send_package);
app.use('/payment', payment);

/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}
/* eslint-enable no-undef */

/* eslint-disable  no-console */
app.listen(PORT, () => console.log(`Listening on port ${PORT} 🔥🔥`));
/* eslint-enable  no-console */