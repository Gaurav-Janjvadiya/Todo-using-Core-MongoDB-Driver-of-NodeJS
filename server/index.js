import express from "express";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT || 8000;

const client = new MongoClient(MONGO_DB_URL);

async function connectDB() {
  try {
    await client.connect();
    console.log("DB Connected successfully!");
  } catch (error) {
    console.log(error);
    console.error("Error connecting DB", error);
    process.exit(1);
  }
}

connectDB();

const db = client.db("basictodo");
const collection = await db.createCollection("todos");

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await collection.find().toArray();
    console.log(todos);
    if (!todos && todos.length < 0) {
      return res.status(204).json({ message: "Todos not found" });
    }
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const todo = req.body;
    const newTodo = await collection.insertOne(todo);
    if (!newTodo)
      return res.status(500).json({ message: "Todo creation failed!" });
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await collection.findOne({ _id: new ObjectId(req.params.id) });
    const newTodo = req.body;
    if (!newTodo) return res.status(200).json(todo);
    const updatedTodo = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { todo: newTodo.todo } }
    );
    if (updatedTodo.modifiedCount <= 0) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
    res.status(200).json({ message: "todo Updated!" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedItem = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(deletedItem.deletedCount);
    res.status(200).json({ message: "Deleted Sucessfully" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
