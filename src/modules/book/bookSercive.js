import { bookInputValidation, bookUpdateValidation } from "./validator.js";
import { bookModel } from "../../databasedConnetion/models/book.model.js";

export const addBook = async (req, res) => {
  let { title, author, publishedYear, availableCopies } = req.body;
  let { userId } = req.user;
  if (!userId) {
    return res.status(403).json({
      message: "you should login first",
    });
  }
  const { error } = bookInputValidation.validate({
    title,
    author,
    publishedYear,
    availableCopies,
  });

  if (error) {
    return res.status(404).json({
      message: error.message,
    });
  } else {
    const newBook = await bookModel.insertMany({
      title,
      author,
      publishedYear,
      availableCopies,
    });
    if (!newBook) {
      res.status(500).json({
        message: "Book has not been created!",
      });
    } else {
      res.status(201).json({
        message: "Book created successfully!",
      });
    }
  }
};

export const getAllBooks = async (req, res) => {
  let { sortBy, order } = req.query;
  const sortOrder = order === "desc" ? -1 : 1;
  const books = await bookModel
    .find()
    .sort(sortBy ? { [sortBy]: sortOrder } : {});
  if (books.length <= 0) {
    res.status(204).json({
      message: "Sorry, there is no books",
    });
  } else {
    res.status(200).json({
      message: "books:",
      data: books,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "author",
      "publishedYear",
      "availableCopies",
    ];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const { error } = bookUpdateValidation.validate(updateData);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedBook = await bookModel.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json({
      message: "Book Updated successfully!",
      data: updatedBook,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await bookModel.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }
    res.status(200).json({
      message: "Book Deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchBook = async (req, res) => {
  try {
    let { searchWord, page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    let filter = {};

    if (searchWord) {
      filter = {
        $or: [
          { title: { $regex: searchWord, $options: "i" } },
          { author: { $regex: searchWord, $options: "i" } },
        ],
      };
    }
    const books = await bookModel.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      page,
      limit,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
