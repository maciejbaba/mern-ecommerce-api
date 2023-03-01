const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", require("./routes/404"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
