import dotenv from "dotenv";
import app from "./app.js";
import express from "express";
import db from "./database/models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
  try {

    await db.sequelize.authenticate();
    console.log("Database connected");

  } catch (err) {

    console.log("Database error", err);

  }
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});