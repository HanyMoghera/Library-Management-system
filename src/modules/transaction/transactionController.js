import { Router } from "express";
import { auth, allowRoles } from "../../middleware/auth.js";
import {
  borrow,
  returnBook,
  userTransactions,
  allTransactions,
} from "./transactionService.js";

let router = Router();

router.post("/borrow", auth, borrow);
router.patch("/return/:id", auth, allowRoles("member", "admin"), returnBook);
router.get("/user", auth, userTransactions);
router.get("/all", auth, allowRoles("admin"), allTransactions);

export default router;
