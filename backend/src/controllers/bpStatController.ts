import type { Request, Response } from "express";
import BPStat from "../models/BPStat";

// Extend Express Request to include `user`
interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

const createBPStat = async (req: AuthRequest, res: Response) => {
  try {
    const { systolic, diastolic, heartRate } = req.body;

    if (!systolic || !diastolic || !heartRate) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // calculate category

    // create the logic to determine the category based on systolic and diastolic values here

    // save to the database
    const newBPStat = new BPStat({
      systolic,
      diastolic,
      heartRate,
      // category,
      user: req.user?._id,
    });

    await newBPStat.save();

    res.status(201).json(newBPStat);
  } catch (error: any) {
    console.log("Error creating bpStat", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// // pagination => infinite loading
// const getBooks = async (req: Request, res: Response) => {
//   // example call from react native - frontend
//   // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 2;
//     const skip = (page - 1) * limit;

//     const books = await Book.find()
//       .sort({ createdAt: -1 }) // desc
//       .skip(skip)
//       .limit(limit)
//       .populate("user", "username profileImage");

//     const totalBooks = await Book.countDocuments();

//     res.send({
//       books,
//       currentPage: page,
//       totalBooks,
//       totalPages: Math.ceil(totalBooks / limit),
//     });
//   } catch (error) {
//     console.log("Error in get all books route", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const deleteBook = async (req: AuthRequest, res: Response) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     // check if user is the creator of the book
//     if (book.user.toString() !== req.user?._id.toString())
//       return res.status(401).json({ message: "Unauthorized" });

//     // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
//     // delete image from cloduinary as well
//     if (book.image && book.image.includes("cloudinary")) {
//       try {
//         const publicId = book.image.split("/").pop()?.split(".")[0];
//         if (publicId) {
//           await cloudinary.uploader.destroy(publicId);
//         }
//       } catch (deleteError) {
//         console.log("Error deleting image from cloudinary", deleteError);
//       }
//     }

//     await book.deleteOne();

//     res.json({ message: "Book deleted successfully" });
//   } catch (error: any) {
//     console.log("Error deleting book", error);
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

export { createBPStat };
