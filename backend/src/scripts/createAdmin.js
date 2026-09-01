require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = "admin@abuzaabal.com";
  await User.deleteOne({ email });

  await User.create({
    name: "Admin",
    email,
    password: "admin12345",
    role: "admin",
  });

  console.log("Admin ready:", email, "| password: admin12345");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
