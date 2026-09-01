require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    await mongoose.disconnect();
    return;
  }

  await User.create({ name: "Admin", email, password, role: "admin" });
  console.log("Admin created:", email);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});