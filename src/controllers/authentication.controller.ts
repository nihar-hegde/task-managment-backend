import { Request, Response } from "express";
import z from "zod";
import { createUser, getUserByEmail, getUserByUsername } from "../db/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.log("JWT SECRET NOT FOUND");
}

const signUpSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const validateData = signUpSchema.safeParse(req.body);

    if (!validateData.success) {
      res.status(400).json({
        message: "Invalid Input",
      });
    } else {
      const { fullName, email, username, password } = validateData.data;
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          message: "Email already taken!",
        });
      }
      const existingUsername = await getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        fullName,
        email,
        username,
        password: hashedPassword,
      };

      await createUser(userData);

      res.status(200).json({
        message: "User Created Successfuly",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};

const loginBody = z.object({
  username: z.string(),
  password: z.string(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const validateData = loginBody.safeParse(req.body);
    if (!validateData.success) {
      res.status(400).json({
        message: "Invalid inputs",
      });
    } else {
      const { username, password } = validateData.data;
      const user = await getUserByUsername(username).select("+password");
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      if (!user) {
        return res.status(404).json({
          message: "User with the provided Username not found!!!",
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Error while loggin in!" });
        }

        if (result) {
          const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET!
          );
          return res.status(200).json({ message: "Logged in", token: token });
        } else {
          return res.status(411).json({ message: "Incorrect Password" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
};
