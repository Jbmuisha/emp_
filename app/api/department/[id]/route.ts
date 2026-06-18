import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGO_URL = process.env.MONGO_URL as string;

// Schema with departmentId field
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  departmentId: { type: String }  // ← AJOUTER CE CHAMP
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL);
  }
}

// PUT - Assign department to user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const { departmentId } = await request.json();

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { departmentId },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}
