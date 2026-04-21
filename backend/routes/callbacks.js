const express = require('express');
const { CallbackRequest } = require('../models');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Verify OTP token
const verifyOTPToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.phone = decoded.phone;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Request callback
router.post('/', verifyOTPToken, async (req, res) => {
  try {
    const { patientName, email, service, preferredTime, preferredDate, description } = req.body;

    const callbackRequest = await CallbackRequest.create({
      phone: req.phone,
      patientName,
      email,
      service,
      preferredTime,
      preferredDate: new Date(preferredDate),
      description,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Callback request submitted successfully',
      callbackRequest,
      requestId: callbackRequest.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get requests by phone
router.get('/', verifyOTPToken, async (req, res) => {
  try {
    const requests = await CallbackRequest.findAll({
      where: { phone: req.phone },
      order: [['createdAt', 'DESC']]
    });

    res.json(requests.map((request) => request.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel request
router.delete('/:id', verifyOTPToken, async (req, res) => {
  try {
    const request = await CallbackRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.phone !== req.phone) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({ message: 'Callback request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
