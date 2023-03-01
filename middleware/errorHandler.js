const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  if (req.headers.origin) {
    logEvents(
      `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errorLog.log"
    );
  }

  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // 500 - server error

  res.status(status);

  res.json({ message: err.message });
};

module.exports = errorHandler;
