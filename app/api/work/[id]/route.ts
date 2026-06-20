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
  { timestamps: true }
);

const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

async function connectionDb() {
  if (!MONGO_URL) {
    throw new Error(
      "MONGO_URL is not defined in environment variables (add it to .env.local)."
    );
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
): { ok: true } | { ok: false; message: string } {
  const { departmentId, employeeId, days, time } = payload ?? {};

  if (!departmentId || typeof departmentId !== "string") {
    return { ok: false, message: "departmentId is required" };
  }
  if (!employeeId || typeof employeeId !== "string") {
    return { ok: false, message: "employeeId is required" };
  }
  if (!isDay(days)) {
    return {
      ok: false,
      message: `days must be one of: ${DAYS_ENUM.join(", ")}`,
    };
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

function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) {
    const v = (e as { message?: unknown }).message;
    if (typeof v === "string") return v;
  }
  return "Unknown error";
}

// Next.js route handler typing expects `params` to be a plain object.
// Here we keep `context: { params: { id: string } }`.

// GET /api/work/:id
export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  await connectionDb();

  try {
    const { id } = context.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

// PUT /api/work/:id
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  await connectionDb();

  try {
    const { id } = context.params;
    const body = await req.json();

    const validation = validatePayload(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const updated = await Schedule.findByIdAndUpdate(
      id,
      {
        departmentId: body.departmentId,
        employeeId: body.employeeId,
        days: body.days,
        time: {
          start: body.time.start,
          end: body.time.end,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to update schedule" },
      { status: 500 }
    );
  }
}

// DELETE /api/work/:id
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  await connectionDb();

  try {
    const { id } = context.params;
    const deleted = await Schedule.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Schedule deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to delete schedule" },
      { status: 500 }
    );
  }
}

