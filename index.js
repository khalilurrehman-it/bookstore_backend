import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./model/BookModel.js";

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello World!");
});

// Route to save a new book
// post method is used to create a new resource
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({ message: "All fields are required" });
    }

    const newBook = new Book({
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    });

    const book = await Book.create(newBook);

    response.status(201).send(book);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Route to get all books from the database
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find();

    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Route to get one book from the database
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });
