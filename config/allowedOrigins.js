let allowedOrigins;

if (process.env.NODE_ENV === "production") {
  allowedOrigins = ["https://mern-ecommerce-beta.vercel.app"];
} else {
  allowedOrigins = ["http://localhost:5173", "http://localhost:3500"]; // dev mode
}

module.exports = allowedOrigins;
