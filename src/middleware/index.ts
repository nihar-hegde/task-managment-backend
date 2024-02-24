import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { getUserByEmail } from "../db/users";
import { getTaskById } from "../db/task";

dotenv.config();
interface IdentidyI {
  _id: string | ObjectId;
  email: string;
  fullName: string;
}
declare global {
  namespace Express {
    interface Request {
      indentity: IdentidyI;
    }
  }
}
if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET not found");
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "You are not logged in!",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const email = (decoded as JwtPayload).email;
      const exisitingUser = await getUserByEmail(email);
      if (!exisitingUser) {
        return res.sendStatus(400).json({ message: "User not found" });
      }
      req.indentity = exisitingUser;
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const isTaskOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.indentity._id.toString();
    const taskId = req.params.id;
    const getTask = await getTaskById(taskId);
    if (!getTask) {
      return res.status(400).json({ message: "Product Not Found" });
    }
    if (userId !== getTask.userId?.toString()) {
      return res.status(400).json({ message: "UnAuthorized from isTaskOwner" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
