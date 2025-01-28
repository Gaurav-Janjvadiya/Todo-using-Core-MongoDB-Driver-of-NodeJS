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
import cookieParser from "cookie-parser";
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
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
const userTokenCollection = db.collection("tokens");

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

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
      await userCollection.insertOne({
        username,
        email,
        password: hash,
      });
      res.status(201).json({ message: "User sign up is successfully done" });
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
      const isPassCorrect =
        user && (await bcrypt.compare(password, user.password));
      if (!isPassCorrect) {
        return res
          .status(401)
          .json({ message: "Please enter correct password" });
      }
      const accessToken = jwt.sign(
        { _id: user.insertedId },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      const refreshToken = jwt.sign(
        { _id: user.insertedId },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      await userTokenCollection.insertOne({
        userId: user._id,
        token: refreshToken,
        createdAt: Date.now(),
        expires: 7 * 86400,
      });
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      res
        .status(200)
        .json({ accessToken, refreshToken, message: "Logged In Succesfully!" });
    } catch (error) {
      console.log("Error ", error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

app
  .route("/api/refreshToken")
  .post(async (req, res) => {
    const decoded = jwt.verify(req.body, REFRESH_TOKEN_SECRET);
    const { userId } = await userTokenCollection.findOne({ token: req.body });
    if (!decoded._id === userId) return res.send("Error in refresh token");
    const refreshToken = jwt.sign(
      { _id: user.insertedId },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.json({ refreshToken });
  })
  .delete(async (req, res) => {
    await userTokenCollection.deleteOne({ token: req.body });
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  });

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
