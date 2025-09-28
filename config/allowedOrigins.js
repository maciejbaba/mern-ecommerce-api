let allowedOrigins;

if (process.env.NODE_ENV === "production") {
  allowedOrigins = ["https://mern.maciejbaba.dev"];
} else {
  allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3500",
    "http://frontend:3000",
    "http://frontend:5173"
  ]; // dev mode, includes Docker container names
}

module.exports = allowedOrigins;
