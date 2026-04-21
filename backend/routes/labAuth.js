const express = require('express');
const { Op } = require('sequelize');
const { Lab, OTP } = require('../models');
const { generateOTP, getOTPExpiration, isValidPhone, sendOTP } = require('../config/otpService');
const jwt = require('jsonwebtoken');

const router = express.Router();

const generateUniqueLabCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = `LAB${Math.floor(1000 + Math.random() * 9000)}`;
    exists = await Lab.findOne({ where: { labCode: code } });
  }

  return code;
};

// Request OTP for lab login
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Valid 10-digit phone number required' });
    }

    // Check if lab exists with this phone
    const lab = await Lab.findOne({ where: { phone } });
    if (!lab) {
      return res.status(400).json({ message: 'No lab found with this phone number' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    // Delete existing OTP for this phone
    await OTP.destroy({ where: { phone } });

    // Save new OTP
    const otpRecord = await OTP.create({
      phone,
      otp,
      expiresAt,
      attempts: 0
    });

    // Send OTP via SMS (simulated)
    const sendResult = await sendOTP(phone, otp);

    res.json({
      message: 'OTP sent successfully',
      phone,
      testOTP: otp // Remove in production
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP for lab login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP required' });
    }

    // Find lab with this phone
    const lab = await Lab.findOne({ where: { phone } });
    if (!lab) {
      return res.status(400).json({ message: 'No lab found with this phone number' });
    }

    const otpRecord = await OTP.findOne({ where: { phone } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not requested for this phone' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.destroy({ where: { phone } });
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return res.status(400).json({ message: 'Maximum OTP attempts exceeded. Request a new OTP.' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        message: `Invalid OTP. Attempts remaining: ${5 - otpRecord.attempts}`
      });
    }

    // OTP verified successfully
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Generate session token
    const token = jwt.sign(
      { id: lab.id, role: 'lab' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeLab = lab.toJSON();

    res.json({
      message: 'OTP verified successfully',
      token,
      lab: safeLab
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register lab
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, email, phone, labCode, services } = req.body;

    const normalizedServices = Array.isArray(services)
      ? [...new Set(services.map((service) => service.trim()).filter(Boolean))]
      : typeof services === 'string'
      ? [...new Set(services.split(',').map((service) => service.trim()).filter(Boolean))]
      : [];

    // Check if lab exists
    const orConditions = [
      { username: username?.toLowerCase() },
      { email }
    ];
    if (labCode) {
      orConditions.push({ labCode: labCode.toUpperCase() });
    }

    const existingLab = await Lab.findOne({
      where: {
        [Op.or]: orConditions
      }
    });

    if (existingLab) {
      return res.status(400).json({ message: 'Lab with this username, email, or lab code already exists' });
    }

    const finalLabCode = labCode ? labCode.toUpperCase() : await generateUniqueLabCode();

    // Create new lab
    const lab = await Lab.create({
      name,
      username,
      password,
      email,
      phone,
      services: normalizedServices,
      labCode: finalLabCode
    });

    // Generate token
    const token = jwt.sign(
      { id: lab.id, role: 'lab' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeLab = lab.toJSON();

    res.status(201).json({
      message: 'Lab registered successfully',
      token,
      lab: safeLab
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login lab
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const lab = await Lab.findOne({
      where: {
        [Op.or]: [
          { username: identifier?.toLowerCase() },
          { labCode: identifier?.toUpperCase() }
        ]
      }
    });

    if (!lab) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await lab.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: lab.id, role: 'lab' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeLab = lab.toJSON();

    res.json({
      message: 'Login successful',
      token,
      lab: safeLab
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;