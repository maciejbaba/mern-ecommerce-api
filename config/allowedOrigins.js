let allowedOrigins;

if (process.env.NODE_ENV === "production") {
  allowedOrigins = ["https://mern-ecommerce-beta.vercel.app"];
} else {
  allowedOrigins = ["http://localhost:5173", "http://localhost:3500"]; // dev mode, 5173 is the port of the frontend, 3500 is the port of the backend server its needed here for the tests
}

module.exports = allowedOrigins;
