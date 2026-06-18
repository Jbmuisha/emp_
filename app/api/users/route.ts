import bcrypt from "bcryptjs";
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

// GET all users
export async function GET() {
  await connectToDatabase();
  const users = await User.find().select("-password");
  if (!users == null || users.length === 0) {
    return NextResponse.json({ message: "No users found" }, { status: 404 });
  }
  return NextResponse.json(users);
}

// POST create new user
export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const { username, email, password, role } = body;

  if (!username || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
  }

