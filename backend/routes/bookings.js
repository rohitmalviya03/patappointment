const express = require("express");
const { Op } = require("sequelize");
const { AppointmentBooking } = require("../models");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Booking API root
router.get("/", (req, res) => {
  res.json({
    message: "Bookings API is running",
    mode: "single-lab",
    endpoints: {
      createBooking: "POST /api/bookings",
      myBookings: "GET /api/bookings/my-bookings",
      availableSlots: "GET /api/bookings/slots/:date",
      allBookingsForLabDashboard: "GET /api/bookings/all",
      bookingStatsForLabDashboard: "GET /api/bookings/stats",
      updateBookingStatus: "PUT /api/bookings/:id/status",
    },
  });
});

// Verify lab token
const verifyLabToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "lab") {
      return res.status(403).json({ message: "Lab access required" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Verify OTP token
const verifyOTPToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "OTP token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.phone = decoded.phone;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired OTP token" });
  }
};

// Get available slots for single-lab mode
router.get("/slots/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const selectedDate = new Date(date);
    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    selectedDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const existingBookings = await AppointmentBooking.findAll({
      where: {
        appointmentDate: {
          [Op.gte]: selectedDate,
          [Op.lt]: nextDate,
        },
        status: { [Op.notIn]: ["cancelled", "completed"] },
      },
      attributes: ["startTime"],
    });

    const bookedSlots = new Set(
      existingBookings.map((booking) => booking.startTime),
    );

    // Generate time slots (30-minute intervals)
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const duration = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endTime = `${(hour + Math.floor((minute + duration) / 60)).toString().padStart(2, "0")}:${((minute + duration) % 60).toString().padStart(2, "0")}`;

        slots.push({
          startTime,
          endTime,
          available: !bookedSlots.has(startTime),
        });
      }
    }

    res.json({
      date,
      slots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book appointment
router.post("/", verifyOTPToken, async (req, res) => {
  try {
    const {
      service,
      appointmentDate,
      startTime,
      endTime,
      patientName,
      patientAddress,
    } = req.body;

    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Check if slot is already booked
    const existingBooking = await AppointmentBooking.findOne({
      where: {
        appointmentDate: {
          [Op.gte]: selectedDate,
          [Op.lt]: nextDate,
        },
        startTime,
        status: { [Op.notIn]: ["cancelled", "completed"] },
      },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const booking = await AppointmentBooking.create({
      phone: req.phone,
      patientName,
      patientAddress,
      service,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      status: "confirmed",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      booking,
      confirmationNumber: booking.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings for the verified OTP/mobile user
router.get("/my-bookings", verifyOTPToken, async (req, res) => {
  try {
    const bookings = await AppointmentBooking.findAll({
      where: { phone: req.phone },
      order: [
        ["appointmentDate", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    res.json({ bookings: bookings.map((booking) => booking.toJSON()), phone: req.phone });
  } catch (error) {
    console.error("Error fetching mobile bookings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (for lab dashboard) with filtering
router.get("/all", verifyLabToken, async (req, res) => {
  try {
    const {
      search,
      status,
      service,
      dateRange,
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object for single-lab mode
    let filter = {};

    // Search filter (patient name, phone, or address)
    if (search && search.trim()) {
      const like = `%${search.trim()}%`;
      filter[Op.or] = [
        { patientName: { [Op.like]: like } },
        { phone: { [Op.like]: like } },
        { patientAddress: { [Op.like]: like } },
      ];
    }

    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Service filter
    if (service && service !== "all") {
      filter.service = service;
    }

    // Date range filter
    if (dateRange && dateRange !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateRange) {
        case "today":
          filter.appointmentDate = {
            [Op.gte]: today,
            [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          };
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          filter.appointmentDate = { [Op.gte]: weekAgo };
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          filter.appointmentDate = { [Op.gte]: monthAgo };
          break;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get filtered and paginated results
    const bookings = await AppointmentBooking.findAll({
      where: filter,
      order: [
        ["appointmentDate", "DESC"],
        ["startTime", "DESC"],
      ],
      offset: skip,
      limit: parseInt(limit, 10),
    });

    // Get total count for pagination
    const totalCount = await AppointmentBooking.count({ where: filter });

    res.json({
      bookings: bookings.map((booking) => booking.toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: parseInt(page) * parseInt(limit) < totalCount,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get appointment stats (for lab dashboard)
router.get("/stats", verifyLabToken, async (req, res) => {
  try {
    const result = {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    const statuses = ["pending", "confirmed", "completed", "cancelled"];
    for (const status of statuses) {
      const count = await AppointmentBooking.count({ where: { status } });
      result[status] = count;
      result.total += count;
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update booking status (for lab dashboard)
router.put("/:id/status", verifyLabToken, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await AppointmentBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking: booking.toJSON(),
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
