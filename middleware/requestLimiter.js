const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const requestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 5 requests per windowMs
  message: "Too many request from this IP, please try again after 5 minutes",
  handler: (req, res, next) => {
    logEvents(
      `${req.ip} has exceeded the 5 requests per 5 minutes limit\n`,
      "errorLog.log"
    );
    res
      .status(429)
      .json({
        message:
          "Too many request from this IP, please try again after 5 minutes",
      });
  },
});

module.exports = requestLimiter;
