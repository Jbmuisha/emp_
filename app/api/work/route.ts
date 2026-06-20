import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGO_URL = process.env.MONGO_URL as string;

const DAYS_ENUM = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

type Day = (typeof DAYS_ENUM)[number];

const timeSchema = {
  start: { type: String, required: true, trim: true }, // HH:mm
  end: { type: String, required: true, trim: true }, // HH:mm
};

const scheduleSchema = new mongoose.Schema(
  {
    departmentId: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, trim: true },

    days: {
      type: String,
      required: true,
      enum: DAYS_ENUM,
    },

    time: {
      ...timeSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

async function connectionDb() {
  if (!MONGO_URL) {
    const errMsg =
      "MONGO_URL is not defined in environment variables (add it to .env.local).";
    throw new Error(errMsg);
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL);
  }
}

function isValidHHmm(value: unknown) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isDay(value: unknown): value is Day {
  return typeof value === "string" && (DAYS_ENUM as readonly string[]).includes(value);
}

type ScheduleCreateBody = {
  departmentId?: unknown;
  employeeId?: unknown;
  days?: unknown;
  time?: unknown;
};

function validatePayload(
  payload: ScheduleCreateBody
):
  | { ok: true }
  | { ok: false; message: string } {


  const { departmentId, employeeId, days, time } = payload ?? {};

  if (!departmentId || typeof departmentId !== "string") {
    return { ok: false, message: "departmentId is required" };
  }
  if (!employeeId || typeof employeeId !== "string") {
    return { ok: false, message: "employeeId is required" };
  }
  if (!isDay(days)) {
    return { ok: false, message: `days must be one of: ${DAYS_ENUM.join(", ")}` };
  }

  if (!time || typeof time !== "object") {
    return { ok: false, message: "time is required" };
  }
  const timeObj = time as { start?: unknown; end?: unknown };
  if (!isValidHHmm(timeObj.start) || !isValidHHmm(timeObj.end)) {
    return { ok: false, message: "time.start/time.end must be HH:mm" };
  }

  return { ok: true };
}

// GET /api/work?departmentId=...&employeeId=...&days=...
export async function GET(req: Request) {
  await connectionDb();

  try {
    const url = new URL(req.url);
    const departmentId = url.searchParams.get("departmentId") ?? undefined;
    const employeeId = url.searchParams.get("employeeId") ?? undefined;
    const days = url.searchParams.get("days") ?? undefined;

    const filter: Record<string, unknown> = {};
    if (departmentId) filter.departmentId = departmentId;
    if (employeeId) filter.employeeId = employeeId;
    if (days && isDay(days)) filter.days = days;

    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

// POST /api/work
// body: { departmentId, employeeId, days, time: { start, end } }
export async function POST(req: Request) {
  await connectionDb();

  try {
    const body = await req.json();
    const validation = validatePayload(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const created = await Schedule.create({
      departmentId: body.departmentId,
      employeeId: body.employeeId,
      days: body.days,
      time: {
        start: body.time.start,
        end: body.time.end,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error:"Failed to create schedule" },
      { status: 500 }
    );
  }
}

