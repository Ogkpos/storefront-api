import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a valid Database URL");
  }
  app.listen(port, () => {
    console.log("Connected to hosted db");
    console.log(`Server running on ${port}`);
  });
};
start();
