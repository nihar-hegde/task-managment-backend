import express from "express";
import { signup } from "../controllers/authentication.controller";
import {
  createNewTask,
  deleteTask,
  getAllTasksOfUser,
  updateTask,
} from "../controllers/task.controller";
import { isAuthenticated, isTaskOwner } from "../middleware";

const taskRouter = express.Router();

taskRouter.post("/create", isAuthenticated, createNewTask);
taskRouter.get("/get", isAuthenticated, getAllTasksOfUser);
taskRouter.delete("/delete/:id", isAuthenticated, isTaskOwner, deleteTask);
taskRouter.put("/update/:id", isAuthenticated, isTaskOwner, updateTask);

export default taskRouter;
