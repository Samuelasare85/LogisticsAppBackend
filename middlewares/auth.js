const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuthenticated(req, res, next) {
    let token;
    if (req?.headers?.authorization && req?.headers?.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({
        'status' : 'error',
        'error' : ' User is not authenticated'
    });
     /* eslint-disable no-undef */
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(400).send({ message: 'Invalid token' });
      }
    /* eslint-enable no-undef */
}

module.exports = isAuthenticated;