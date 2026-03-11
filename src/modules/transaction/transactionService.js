import { transactionModel } from "../../databasedConnetion/models/transaction.model.js";
import { bookModel } from "../../databasedConnetion/models/book.model.js";
import { userModel } from "../../databasedConnetion/models/user.model.js";

export const borrow = async (req, res) => {
  const { userId } = req.user;
  let { bookId } = req.body;
  if (!userId) {
    return res.status(403).json({
      message: "you should lgoin first",
    });
  }
  let book = await bookModel.findById(bookId);
  if (!book) {
    return res.status(404).json({
      message: "book not found!",
    });
  }
  if (book.availableCopies < 1) {
    return res.status(404).json({
      message: "Sorry this book has no coppies left!",
    });
  }
  book.availableCopies -= 1;
  book.save();

  const borrowing = await transactionModel.create({
    userId,
    bookId,
    status: "borrowed",
  });

  if (!borrowing) {
    res.status(500).json({
      message: "sth went wrong",
    });
  } else {
    res.status(201).json({
      message: "Borrow created successfully",
      data: borrowing,
    });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const user = await userModel.findById(userId);
    console.log(req.user);

    if (!user) {
      return res.status(403).json({
        message: "you should login first",
      });
    }

    const transaction = await transactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({
        message: "transaction not found",
      });
    }

    if (user.role != "admin") {
      if (transaction.userId.toString() !== userId) {
        return res.status(403).json({
          message: "you cannot return this book",
        });
      }
    }

    if (transaction.status === "returned") {
      return res.status(400).json({
        message: "book already returned",
      });
    }

    transaction.status = "returned";
    await transaction.save();

    const book = await bookModel.findById(transaction.bookId);

    if (!book) {
      return res.status(404).json({
        message: "book not found",
      });
    }

    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      message: "book returned successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const userTransactions = async (req, res) => {
  let { userId } = req.user;

  if (!userId) {
    return res.status(403).json({
      message: "you should login first!",
    });
  }
  let userTransactions = await transactionModel
    .find({ userId: userId })
    .populate("bookId");
  if (userTransactions.length == 0 || !userTransactions) {
    return res.status(204).json({
      message: "Sorry there is no transactions for this user",
    });
  }
  res.status(200).json({
    message: "transactions found",
    data: userTransactions,
  });
};

export const allTransactions = async (req, res) => {
  let { status } = req.query;

  if (status) {
    const transactions = await transactionModel
      .find({ status: status })
      .sort({ borrowDate: 1 });
    if (!transactions) {
      return res.status(404).json({
        message: "Sorry there is no transactions",
      });
    } else {
      return res.status(200).json({
        message: "Transaction found",
        transactions: transactions,
      });
    }
  } else {
    const transactions = await transactionModel.find();
    if (!transactions) {
      return res.status(404).json({
        message: "Sorry there is no transactions",
      });
    } else {
      return res.status(200).json({
        message: "Transaction found",
        transactions: transactions,
      });
    }
  }
};
