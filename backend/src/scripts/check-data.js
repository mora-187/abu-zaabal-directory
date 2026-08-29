require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Provider = require("../models/Provider");

const checkData = async () => {
  try {
    await connectDB();

    const providersFile = path.join(
      __dirname,
      "../../data/providers_final.json"
    );

    const categoriesFile = path.join(
      __dirname,
      "../../data/categories_final.json"
    );

    const providersSource = JSON.parse(
      fs.readFileSync(providersFile, "utf8")
    );

    const categoriesSource = JSON.parse(
      fs.readFileSync(categoriesFile, "utf8")
    );

    const totalProviders = await Provider.countDocuments();

    const activeProviders = await Provider.countDocuments({
      isActive: true,
    });

    const groups = await Provider.distinct("groups");

    const categories = await Provider.distinct("categories");

    const firstProvider = await Provider.findOne();

    console.log("Database Check");
    console.log("--------------------------");

    console.log(
      `Providers in source file: ${providersSource.length}`
    );

    console.log(
      `Providers in database: ${totalProviders}`
    );

    console.log(
      `Active providers: ${activeProviders}`
    );

    console.log(
      `Main groups in database: ${groups.length}`
    );

    console.log(
      `Categories in database: ${categories.length}`
    );

    console.log(
      `Categories in source file: ${categoriesSource.length}`
    );

    console.log("First provider:");
    console.log(firstProvider);

    if (totalProviders !== providersSource.length) {
      console.warn(
        "WARNING: Database provider count does not match source file."
      );
    }

  } catch (error) {

    console.error(
      "Data check failed:",
      error.message
    );

    process.exitCode = 1;

  } finally {

    await mongoose.disconnect();

  }
};

checkData();
