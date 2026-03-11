import { Router } from "express";
import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  searchBook,
} from "./bookSercive.js";
import { auth, allowRoles } from "../../middleware/auth.js";

let router = Router();

router.post("/", auth, allowRoles("admin"), addBook);

router.get("/", auth, getAllBooks);

router.patch("/:id", auth, allowRoles("admin"), updateBook);

router.delete("/:id", auth, allowRoles("admin"), deleteBook);

router.get("/search", auth, searchBook);

export default router;
