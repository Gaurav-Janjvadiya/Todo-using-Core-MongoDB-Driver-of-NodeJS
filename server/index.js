import express from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
config();

const app = express();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(MONGO_DB_URL);
let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("basictodo");
    collection = db.createCollection("todos");
    console.log("DB Connected successfully!");
  } catch (error) {
    console.log(error);
    console.error("Error connecting DB", error);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
