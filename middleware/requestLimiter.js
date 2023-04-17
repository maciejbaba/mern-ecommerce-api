const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 2 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many request from this IP, please try again after 2 minutes',
  handler: (req, res, next) => {
    logEvents(`${req.ip} has exceeded the 5 requests per 2 minutes limit`, 'errorLog.log');
    next();
  },
});

module.exports = requestLimiter;