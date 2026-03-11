import mongoose from "mongoose";

export const transactionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["borrowed", "returned"],
  },
});

export const transactionModel = mongoose.model(
  "Transaction",
  transactionSchema,
);
