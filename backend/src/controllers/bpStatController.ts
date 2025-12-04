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
    // low risk sys < 90 or dia < 60
    // normal sys <120 and dia <80
    //elevated sys 120-129 and dia < 80
    //stage 1 sys 130-139 or dia 80-89
    //stage 2 sys >=140 or dia >=90
    //hypertensive crisis sys >180 and/or dia >120

    function calculateCategory(systolic: number, diastolic: number): string {
      if (systolic > 180 || diastolic > 120) {
        return "Hypertensive Crisis";
      }
      if (systolic >= 140 || diastolic >= 90) {
        return "Stage 2 Hypertension";
      }
      if (
        (systolic >= 130 && systolic <= 139) ||
        (diastolic >= 80 && diastolic <= 89)
      ) {
        return "Stage 1 Hypertension";
      }
      if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
        return "Elevated";
      }
      if (systolic < 120 && diastolic < 80) {
        return "Normal";
      }
      if (systolic < 90 || diastolic < 60) {
        return "Low";
      }
      return "Uncategorized";
    }
    const category = calculateCategory(systolic, diastolic);

    // save to the database
    const newBPStat = new BPStat({
      Systolic: systolic,
      Diastolic: diastolic,
      HeartRate: heartRate,
      Category: category,
      user: req.user?._id,
    });

    await newBPStat.save();

    res.status(201).json(newBPStat);
  } catch (error: any) {
    console.log("Error creating bpStat", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// pagination => infinite loading
const getBPStats = async (req: Request, res: Response): Promise<void> => {
  // example call from react native - frontend
  // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50); // cap at 50
    const skip = (page - 1) * limit;

    const bpStats = await BPStat.find()
      .sort({ createdAt: -1 }) // desc
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBPStats = await BPStat.countDocuments();

    res.json({
      success: true,
      data: bpStats,
      pagination: {
        currentPage: page,
        totalBPStats,
        totalPages: Math.ceil(totalBPStats / limit),
      },
    });
  } catch (error) {
    console.log("Error in get all bpStats route", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

const deleteBPStat = async (req: AuthRequest, res: Response) => {
  try {
    const bpstat = await BPStat.findById(req.params.id);
    if (!bpstat) return res.status(404).json({ message: "BpStat not found" });

    // check if user is the creator of the bpStat
    if (bpstat.user.toString() !== req.user?._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    await bpstat.deleteOne();

    res.json({ message: "BpStat deleted successfully" });
  } catch (error: any) {
    console.log("Error deleting bpStat", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export { createBPStat, getBPStats, deleteBPStat };
