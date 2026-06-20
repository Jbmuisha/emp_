const Schedule = require("../models/schedule");

const DAY_ENUM = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function isValidHHmm(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validatePayload(payload) {
  const { department, employeeId, days, time } = payload || {};

  if (!department || typeof department !== "string") {
    return { ok: false, message: "department is required" };
  }
  if (!employeeId || typeof employeeId !== "string") {
    return { ok: false, message: "employeeId is required" };
  }
  if (!days || typeof days !== "string" || !DAY_ENUM.includes(days)) {
    return { ok: false, message: "days must be one of Lun..Dim" };
  }
  if (!time || typeof time !== "object") {
    return { ok: false, message: "time is required" };
  }
  if (!isValidHHmm(time.start) || !isValidHHmm(time.end)) {
    return { ok: false, message: "time.start and time.end must be HH:mm" };
  }

  return { ok: true };
}

exports.createSchedule = async (req, res) => {
  try {
    const validation = validatePayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const created = await Schedule.create({
      department: req.body.department,
      employeeId: req.body.employeeId,
      days: req.body.days,
      time: {
        start: req.body.time.start,
        end: req.body.time.end,
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getScheduler = async (req, res) => {
  try {
    const { department, employeeId, days } = req.query || {};

    const filter = {};
    if (department) filter.department = department;
    if (employeeId) filter.employeeId = employeeId;
    if (days) filter.days = days;

    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });
    return res.json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSchedulerId = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    return res.json(schedule);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validatePayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const updated = await Schedule.findByIdAndUpdate(
      id,
      {
        department: req.body.department,
        employeeId: req.body.employeeId,
        days: req.body.days,
        time: {
          start: req.body.time.start,
          end: req.body.time.end,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Schedule.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    return res.json({ message: "Schedule deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

