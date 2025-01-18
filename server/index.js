import express from "express";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signInUser, SignUpUser } from "./validators/userValidator.js";
import validateMiddleware from "./middlewares/validateMiddleware.js";
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
const collection = db.collection("todos");
const userCollection = db.collection("users");

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

const JWT_SECRET = process.env.JWT_SECRET;

app.post(
  "/api/user/signup",
  (req, res) => validateMiddleware(SignUpUser, req.body),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await userCollection.insertOne({
        username,
        email,
        password: hash,
      });
      const token = jwt.sign({ _id: user.insertedId }, JWT_SECRET, {
        expiresIn: "24h",
      });
      res.status(200).json({ jwt: token });
    } catch (error) {
      console.log(error);
      res.send();
    }
  }
);

app.post("/api/user/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userCollection.findOne({ username: username });
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      res.status(401).json({ message: "please enter correct password" });
    }
    const token = jwt.sign({ _id: user.insertedId }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ jwt: token });
  } catch (error) {
    console.log("Error ", error);
    res.send("");
  }
});

// app.post("/api/user/signout",(req,res) => {
//   try {

//   } catch (error) {

//   }
// })

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
