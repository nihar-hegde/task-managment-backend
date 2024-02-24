import mongoose from "mongoose";
import { Values } from "zod";
import { ObjectId } from "mongodb";
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Make the title mandatory
    trim: true, // Remove leading/trailing whitespace automatically
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const TaskModel = mongoose.model("Task", TaskSchema);

// Task actions

export const getAllTasks = (filter: string, userId: string | ObjectId) =>
  TaskModel.find({
    $and: [
      { userId: userId },
      {
        $or: [{ title: { $regex: filter, $options: "i" } }],
      },
    ],
  });

export const getTaskById = (id: string) => TaskModel.findById(id);

export const createTask = (value: Record<string, any>) =>
  TaskModel.create(value);

export const deleteTaskById = (id: string) =>
  TaskModel.findByIdAndDelete({ _id: id });

export const updateTaskById = (id: string, value: Record<string, any>) =>
  TaskModel.findByIdAndUpdate(id, value);
