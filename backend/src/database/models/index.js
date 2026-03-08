// index.js

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";

import config from "../../config/config.cjs";
const envConfig = config[env];

export const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    ...envConfig,
    logging: false,
  }
);

try {
  await sequelize.authenticate();
} catch (err) {
  console.error("Database connection failed:", err.message);
  process.exit(1);
}

const db = {};

const loadModelsRecursively = async (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (fullPath === __filename) continue;

    if (entry.isDirectory()) {
      await loadModelsRecursively(fullPath);
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".model.js")

    ) {

      const modelPath = pathToFileURL(fullPath).href;
      const modelModule = await import(modelPath);

      if (typeof modelModule.default !== "function") {
        throw new Error(`❌ Model file ${entry.name} has no default export`);
      }

      const result = modelModule.default(sequelize, Sequelize.DataTypes);

      // Check if result is a Sequelize model (has sequelize property) or an object of models
      if (result && typeof result === "function" && result.tableName) {
        // Single Sequelize model returned (class/constructor)
        db[result.name] = result;
      } else if (result && typeof result === "object" && !Array.isArray(result)) {
        // Object containing multiple models - register each one
        for (const [key, model] of Object.entries(result)) {
          if (model && typeof model === "function" && model.tableName) {
            db[model.name] = model;
          }
        }
      } else {
        throw new Error(`❌ Model file ${entry.name} returned invalid model`);
      }
    }
  }
};

await loadModelsRecursively(__dirname);

Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export const {
 User,
 Resume
} = db;


export default db;

