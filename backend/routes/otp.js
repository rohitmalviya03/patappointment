const express = require('express');
const { OTP } = require('../models');
const { generateOTP, getOTPExpiration, isValidPhone, sendOTP } = require('../config/otpService');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify OTP token
const verifyOTPToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'OTP token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.phone = decoded.phone;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired OTP token' });
  }
};

// Step 1: Request OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Valid 10-digit phone number required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    // Delete existing OTP for this phone
    await OTP.destroy({ where: { phone } });

    // Save new OTP
    await OTP.create({
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

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    let { phone, otp } = req.body;

    // Sanitize input
    phone = phone?.trim();
    otp = otp?.toString().trim();

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP required' });
    }

    const otpRecord = await OTP.findOne({ where: { phone } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not requested for this phone' });
    }

    // 🔥 Check attempts FIRST
    if (otpRecord.attempts >= 5) {
      await OTP.destroy({ where: { phone } });
      return res.status(400).json({ 
        message: 'Maximum OTP attempts exceeded. Request a new OTP.' 
      });
    }

    // 🔥 Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await OTP.destroy({ where: { phone } });
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // 🔥 Convert both to string before compare
    if (String(otpRecord.otp) !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({ 
        message: `Invalid OTP. Attempts remaining: ${5 - otpRecord.attempts}` 
      });
    }

    // ✅ OTP SUCCESS
    await OTP.destroy({ where: { phone } }); // IMPORTANT: prevent OTP reuse.

    const token = jwt.sign(
      { phone, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      message: 'OTP verified successfully',
      token,
      phone
    });

  } catch (error) {
    console.error("OTP VERIFY ERROR:", error); // 🔥 Debug log
    res.status(500).json({ message: error.message });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Valid 10-digit phone number required' });
    }

    // Delete old OTP
    await OTP.destroy({ where: { phone } });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    await OTP.create({
      phone,
      otp,
      expiresAt,
      attempts: 0
    });

    // Send OTP
    await sendOTP(phone, otp);

    res.json({
      message: 'OTP resent successfully',
      phone,
      testOTP: otp // Remove in production
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
