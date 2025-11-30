import mongoose from "mongoose";

const bpStatSchema = new mongoose.Schema(
  {
    Systolic: {
      type: Number,
      required: true,
    },
    Diastolic: {
      type: Number,
      required: true,
    },
    HeartRate: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      enum: [
        "Low",
        "Normal",
        "Elevated",
        "Stage 1 Hypertension",
        "Stage 2 Hypertension",
        "Hypertensive Crisis",
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const BPStat = mongoose.model("BPStat", bpStatSchema);

export default BPStat;
