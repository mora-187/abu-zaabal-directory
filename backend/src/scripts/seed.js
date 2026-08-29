require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Provider = require("../models/Provider");

const seed = async () => {
  try {
    await connectDB();

    const file = path.join(
      __dirname,
      "../../data/providers_final.json"
    );

    const data = JSON.parse(
      fs.readFileSync(file, "utf8")
    );

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(
        "providers_final.json is empty or invalid."
      );
    }

    await Provider.deleteMany({});
    await Provider.insertMany(data);

    console.log(
      `${data.length} providers added successfully`
    );

    console.log(
      "WARNING: Re-running the seed replaces all providers in the collection."
    );

  } catch (error) {

    console.error("Seed failed:", error.message);
    process.exitCode = 1;

  } finally {

    await mongoose.disconnect();

  }
};

seed();
