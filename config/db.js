import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};