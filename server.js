require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const { logger, logEvents } = require("./middleware/logger");

const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");

const PORT = require("./config/PORT");
const requestLimiter = require("./middleware/requestLimiter");

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.use(requestLimiter); // test this later

app.use("/users", require("./routes/usersRoutes"));
app.use("/items", require("./routes/itemsRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.all("*", require("./routes/404"));

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to the database");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
