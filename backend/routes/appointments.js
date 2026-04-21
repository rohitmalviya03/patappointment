const express = require('express');
const { Op } = require('sequelize');
const { Appointment, Lab } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user appointments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patient: req.userId },
      include: [
        {
          model: Lab,
          as: 'labDetails',
          attributes: ['id', 'name', 'address', 'phone']
        }
      ],
      order: [['appointmentDate', 'DESC']]
    });

    const response = appointments.map((appointment) => {
      const data = appointment.toJSON();
      if (appointment.labDetails) {
        const lab = appointment.labDetails.toJSON();
        data.lab = {
          _id: lab._id,
          name: lab.name,
          address: lab.address,
          phone: lab.phone
        };
      }
      delete data.labDetails;
      return data;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available slots for a lab
router.get('/availability/:labId', async (req, res) => {
  try {
    const lab = await Lab.findByPk(req.params.labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // TODO: Implement slot generation logic
    const slots = [];
    res.json({ labId: req.params.labId, slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book appointment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { labId, service, appointmentDate, startTime, endTime, notes } = req.body;

    // Check lab exists
    const lab = await Lab.findByPk(labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      where: {
        lab: labId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        status: { [Op.ne]: 'cancelled' }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.userId,
      lab: labId,
      service,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      notes
    });

    const created = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Lab,
          as: 'labDetails',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    const payload = created.toJSON();
    if (created.labDetails) {
      const labData = created.labDetails.toJSON();
      payload.lab = {
        _id: labData._id,
        name: labData.name,
        address: labData.address
      };
    }
    delete payload.labDetails;

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: payload
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Allow update if: patient (owner), admin, or lab staff
    const isPatient = appointment.patient === req.userId;
    const isAdmin = req.userRole === 'admin';
    const isLabStaff = req.userRole === 'lab';

    if (!isPatient && !isAdmin && !isLabStaff) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment' });
    }

    Object.assign(appointment, req.body);
    await appointment.save();

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
