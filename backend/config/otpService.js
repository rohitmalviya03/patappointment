// OTP Service - handles OTP generation and validation

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get OTP expiration time (5 minutes from now)
const getOTPExpiration = () => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  return expiresAt;
};

// Validate OTP format
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Simulate sending OTP (in production, use SMS service like Twilio)
const sendOTP = async (phone, otp) => {
  try {
    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`📱 OTP sent to ${phone}: ${otp}`);
    
    // In development, return the OTP for testing
    return {
      success: true,
      message: `OTP sent to ${phone}`,
      testOTP: otp // Remove in production
    };
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

module.exports = {
  generateOTP,
  getOTPExpiration,
  isValidPhone,
  sendOTP
};
