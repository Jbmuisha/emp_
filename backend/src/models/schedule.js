const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, trim: true },

    days: {
      type: String,
      required: true,
      enum: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    },

    time: {
      start: { type: String, required: true, trim: true }, // HH:mm
      end: { type: String, required: true, trim: true }, // HH:mm
    },
  },
  { timestamps: true }
);

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;

