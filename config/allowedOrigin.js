let allowedOrigin;

if (process.env.NODE_ENV === "production") {
  allowedOrigin = "https://mern-ecommerce-beta.vercel.app";
} else {
  allowedOrigin = "http://localhost:3000";
}

module.exports = allowedOrigin;
