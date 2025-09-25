const bcrypt = require("bcrypt");
const User = require("../models/User");
const Item = require("../models/Item");

const seedDatabase = async () => {
  try {
    console.log("🌱 Checking if database needs seeding...");

    // Check if users already exist
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      console.log("📊 Users already exist, skipping user seeding");
    } else {
      console.log("👤 Creating default users...");

      const saltRounds = 12;

      // Create admin user
      const adminPassword = await bcrypt.hash("admin", saltRounds);
      const adminUser = new User({
        username: "admin",
        password: adminPassword,
        isAdmin: true,
        active: true,
      });
      await adminUser.save();
      console.log("👑 Created admin user (username: admin, password: admin)");

      // Create regular user
      const userPassword = await bcrypt.hash("user", saltRounds);
      const regularUser = new User({
        username: "user",
        password: userPassword,
        isAdmin: false,
        active: true,
      });
      await regularUser.save();
      console.log("👤 Created regular user (username: user, password: user)");
    }

    // Check if items already exist
    const itemCount = await Item.countDocuments();

    if (itemCount > 0) {
      console.log("🛍️ Items already exist, skipping item seeding");
    } else {
      console.log("🛍️ Creating sample items...");

      const sampleItems = [
        {
          name: "Wireless Bluetooth Headphones",
          description:
            "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
          price: 149.99,
          photoURL: "images/headphones.png",
        },
        {
          name: "Smart Fitness Tracker",
          description:
            "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications. Track your daily activities and health metrics.",
          price: 79.99,
          photoURL: "images/fitness-tracker.png",
        },
        {
          name: "Organic Coffee Beans - Premium Blend",
          description:
            "100% organic, fair-trade coffee beans from sustainable farms. Medium roast with rich, smooth flavor profile.",
          price: 24.99,
          photoURL: "images/coffee-beans.png",
        },
        {
          name: "Ergonomic Office Chair",
          description:
            "Comfortable ergonomic office chair with lumbar support, adjustable height, and breathable mesh back. Perfect for long work sessions.",
          price: 299.99,
          photoURL: "images/office-chair.png",
        },
        {
          name: "Portable Power Bank 20000mAh",
          description:
            "High-capacity portable charger with fast charging technology. Compatible with all smartphones, tablets, and USB devices.",
          price: 34.99,
          photoURL: "images/power-bank.png",
        },
        {
          name: "Stainless Steel Water Bottle",
          description:
            "Eco-friendly, double-walled stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
          price: 19.99,
          photoURL: "images/water-bottle.png",
        },
        {
          name: "Wireless Phone Charger",
          description:
            "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.",
          price: 29.99,
          photoURL: "images/wireless-charger.png",
        },
        {
          name: "Premium Yoga Mat",
          description:
            "Non-slip, eco-friendly yoga mat made from natural rubber. Extra thick for comfort with excellent grip and durability.",
          price: 59.99,
          photoURL: "images/yoga-mat.png",
        },
        {
          name: "Smart Home LED Bulbs (4-pack)",
          description:
            "WiFi-enabled LED smart bulbs with 16 million colors, dimming control, and voice assistant compatibility.",
          price: 49.99,
          photoURL: "images/smart-bulbs.png",
        },
        {
          name: "Professional Chef's Knife",
          description:
            "High-carbon stainless steel chef's knife with ergonomic handle. Sharp, durable blade perfect for all kitchen tasks.",
          price: 89.99,
          photoURL: "images/chef-knife.png",
        },
      ];

      await Item.insertMany(sampleItems);
      console.log(`🛍️ Created ${sampleItems.length} sample items`);
    }

    console.log("✅ Database seeding check completed!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
};

module.exports = seedDatabase;
