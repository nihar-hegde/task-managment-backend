import express from "express";
import authRouter from "./authentication";
import taskRouter from "./task-management";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/task", taskRouter);

export default router;
