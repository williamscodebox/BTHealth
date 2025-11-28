import express from "express";
import type { Request, Response } from "express"; // 👈 use `type` keyword
import "dotenv/config";
import cors from "cors";

//import { connectDB } from "./lib/db.ts";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//job.start();
app.use(cors());

//app.use("/api/auth", authRoutes);
//app.use("/api/books", bookRoutes);

// 👇 Define a root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Bookworm Backend!");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  console.log(`Server is running on port ${PORT}`);
  //connectDB();
});
