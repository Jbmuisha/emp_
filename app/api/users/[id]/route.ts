import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGO_URL = process.env.MONGO_URL as string;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  departmentId: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL);
  }
}

// GET single user by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

// PUT (update) user by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await request.json();
  const { username, email, role, departmentId } = body;

  const user = await User.findByIdAndUpdate(id, { username, email, role, departmentId }, { new: true }).select("-password");
  return NextResponse.json(user);
}

// DELETE user by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}
