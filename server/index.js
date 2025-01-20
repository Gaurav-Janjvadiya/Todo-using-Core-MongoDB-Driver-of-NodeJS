import express from "express";
import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { signInUser, signUpUser } from "./validators/userValidator.js";
import { todo } from "./validators/todoValidator.js";
import validateMiddleware from "./middlewares/validateMiddleware.js";
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

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
// const

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await collection.find().toArray();
    if (!todos && todos.length < 0) {
      return res.status(404).json({ message: "Todos not found" });
    }
    res.status(200).json({ todos: todos });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

app.post("/api/todos", validateMiddleware(todo), async (req, res) => {
  try {
    const todo = req.body;
    const newTodo = await collection.insertOne(todo);
    if (!newTodo)
      return res.status(400).json({ message: "Todo creation failed!" });
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await collection.findOne({ _id: new ObjectId(req.params.id) });
    const newTodo = req.body;
    if (todo.todo === newTodo.todo)
      return res.status(204).json({ message: "Todo updated successfully" });
    await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { todo: newTodo.todo } }
    );
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    res.status(500).json({
      error: "An unexpected error occurred while updating the To-Do.",
    });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    console.log(result);
    if (!result.deletedCount != 0)
      return res.status(404).json({
        error: "To-Do not found. Deletion failed.",
      });
    res.status(200).json({
      message: "To-Do deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An unexpected error occurred while deleting the To-Do.",
    });
  }
});

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

const generateToken = () => {
  return jwt.sign({ _id: user.insertedId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

app.post(
  "/api/user/signup",
  validateMiddleware(signUpUser),
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const isUser = await userCollection.findOne({ username });
      if (isUser)
        return res.status(409).json({ message: "User already exists" });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await userCollection.insertOne({
        username,
        email,
        password: hash,
      });
      const accessToken = generateToken();
      const refreshToken = jwt.sign(
        { _id: user.insertedId },
        JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/api/user/signin",
  validateMiddleware(signInUser),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userCollection.findOne({ username: username });
      const isPass = user && (await bcrypt.compare(password, user.password));
      if (!isPass) {
        return res
          .status(401)
          .json({ message: "please enter correct password" });
      }
      const token = generateToken();
      res.status(200).json({ jwt: token });
    } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

// app.post("/api/user/signout",(req,res) => {
//   try {

//   } catch (error) {

//   }
// })

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
