import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import { databaseConnection } from "./databasedConnetion/connection.js";
import userRouter from "./modules/user/userController.js";
import bookRouter from "./modules/book/bookController.js";
import transactionRouter from "./modules/transaction/transactionController.js";
import dotenv from "dotenv";
dotenv.config();

export function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use(mongoSanitize({ replaceWith: "_", allowDots: true }));
  databaseConnection();

  app.use("/api/users", userRouter);
  app.use("/api/books", bookRouter);
  app.use("/api/transactions", transactionRouter);

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
