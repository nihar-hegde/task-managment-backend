import { Request, Response } from "express";
import { z } from "zod";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  updateTaskById,
} from "../db/task";

const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.coerce.date(),
});

export const createNewTask = async (req: Request, res: Response) => {
  try {
    const validatedData = TaskSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ message: "Invalid Inptu Data" });
    } else {
      const data = validatedData.data;
      const udpatedData = { ...data, userId: req.indentity._id };
      const addedTask = await createTask(udpatedData);
      res.status(200).json({ message: "Task added successfully!", addedTask });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getAllTasksOfUser = async (req: Request, res: Response) => {
  try {
    const userId = req.indentity._id;
    const filter = req.query.filter || "";
    const allTasks = await getAllTasks(filter as string, userId);
    if (!allTasks) {
      return res.status(404).json({ message: "Tasks not found" });
    } else {
      return res.status(200).json({ allTasks });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await deleteTaskById(productId);
    res.status(200).json({ message: "Task Deleted", deleteProduct });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const validateData = TaskSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({ message: "Invalid input Data" });
    } else {
      const updatedData = await updateTaskById(taskId, validateData.data);
      if (!updatedData) {
        return res.status(400).json({ message: "Failed to update task" });
      } else {
        return res
          .status(200)
          .json({ message: "Task Updated Successfully!!!", updatedData });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
