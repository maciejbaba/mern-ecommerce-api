require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Item = require("../models/Item");

const connectDB = require("../config/dbConnection");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create default users
    const saltRounds = 12;

    // Admin user
    const adminPassword = await bcrypt.hash("admin", saltRounds);
    const adminUser = new User({
      username: "admin",
      password: adminPassword,
      isAdmin: true,
      active: true
    });
    await adminUser.save();
    console.log("👑 Created admin user (username: admin, password: admin)");

    // Regular user
    const userPassword = await bcrypt.hash("user", saltRounds);
    const regularUser = new User({
      username: "user",
      password: userPassword,
      isAdmin: false,
      active: true
    });
    await regularUser.save();
    console.log("👤 Created regular user (username: user, password: user)");

    // Create sample items
    const sampleItems = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        price: 149.99,
        photoURL: "/headphones.jpg"
      },
      {
        name: "Smart Fitness Tracker",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications. Track your daily activities and health metrics.",
        price: 79.99,
        photoURL: "/fitness-tracker.jpg"
      },
      {
        name: "Organic Coffee Beans - Premium Blend",
        description: "100% organic, fair-trade coffee beans from sustainable farms. Medium roast with rich, smooth flavor profile.",
        price: 24.99,
        photoURL: "/coffee-beans.jpg"
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable ergonomic office chair with lumbar support, adjustable height, and breathable mesh back. Perfect for long work sessions.",
        price: 299.99,
        photoURL: "/office-chair.jpg"
      },
      {
        name: "Portable Power Bank 20000mAh",
        description: "High-capacity portable charger with fast charging technology. Compatible with all smartphones, tablets, and USB devices.",
        price: 34.99,
        photoURL: "/power-bank.jpg"
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Eco-friendly, double-walled stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
        price: 19.99,
        photoURL: "/water-bottle.jpg"
      },
      {
        name: "Wireless Phone Charger",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.",
        price: 29.99,
        photoURL: "/wireless-charger.jpg"
      },
      {
        name: "Premium Yoga Mat",
        description: "Non-slip, eco-friendly yoga mat made from natural rubber. Extra thick for comfort with excellent grip and durability.",
        price: 59.99,
        photoURL: "/yoga-mat.jpg"
      },
      {
        name: "Smart Home LED Bulbs (4-pack)",
        description: "WiFi-enabled LED smart bulbs with 16 million colors, dimming control, and voice assistant compatibility.",
        price: 49.99,
        photoURL: "/smart-bulbs.jpg"
      },
      {
        name: "Professional Chef's Knife",
        description: "High-carbon stainless steel chef's knife with ergonomic handle. Sharp, durable blade perfect for all kitchen tasks.",
        price: 89.99,
        photoURL: "/chef-knife.jpg"
      }
    ];

    await Item.insertMany(sampleItems);
    console.log(`🛍️ Created ${sampleItems.length} sample items`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\nDefault accounts created:");
    console.log("Admin - username: admin, password: admin");
    console.log("User - username: user, password: user");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;