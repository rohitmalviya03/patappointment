const express = require("express");
const { Lab, AppointmentBooking } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all labs
router.get("/", async (req, res) => {
  try {
    const labs = await Lab.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    const sanitizedLabs = labs.map((lab) => {
      const data = lab.toJSON();
      delete data.admin;
      return data;
    });
    res.json(sanitizedLabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all known services offered by labs
router.get("/services", async (req, res) => {
  try {
    const labs = await Lab.findAll({
      where: { isActive: true },
      attributes: ["services"],
    });

    const services = [...new Set(
      labs.flatMap((lab) => {
        const entries = lab.services;
        return Array.isArray(entries) ? entries : [];
      })
    )]
      .filter(Boolean)
      .sort();

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get lab by ID
router.get("/:id", async (req, res) => {
  try {
    const lab = await Lab.findByPk(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    res.json(lab.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lab (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      labCode,
      email,
      phone,
      address,
      services,
      workingHours,
      appointmentDuration,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required to create a lab",
      });
    }

    const lab = await Lab.create({
      name,
      username,
      password,
      labCode: labCode || `LAB${Math.floor(1000 + Math.random() * 9000)}`,
      email,
      phone,
      address,
      services: Array.isArray(services) ? services : [],
      workingHours,
      appointmentDuration,
      admin: req.userId,
    });

    res.status(201).json({ message: "Lab created successfully", lab: lab.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lab (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    await lab.update(req.body);

    res.json({ message: "Lab updated successfully", lab: lab.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lab (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    await lab.update({ isActive: false });

    res.json({ message: "Lab deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for logged-in lab
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "lab") {
      return res.status(403).json({ message: "Lab access required" });
    }

    const appointments = await AppointmentBooking.findAll({
      order: [
        ["appointmentDate", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    res.json(appointments.map((appointment) => appointment.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
