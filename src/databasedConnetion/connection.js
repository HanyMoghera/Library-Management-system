import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const databaseConnection = () => {
  const connectionString = process.env.MONGOSTRING;
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log("database connected successfully!");
    })
    .catch((err) => {
      console.log(err);
    });
};
