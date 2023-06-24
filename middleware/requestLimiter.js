const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const requestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many request from this IP, please try again after 1 minute",
  handler: (req, res, next) => {
    logEvents(
      `${req.ip} has exceeded the 20 requests per 1 minute limit\n`,
      "errorLog.log"
    );
    res
      .status(429)
      .json({
        message:
          "Too many request from this IP, please try again after 1 minute",
      });
  },
});

module.exports = requestLimiter;
