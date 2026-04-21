-- MySQL schema for Patient Appointment Booking System
-- Generated to mirror existing Sequelize models.

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(32) DEFAULT NULL,
  role ENUM('patient', 'admin') NOT NULL DEFAULT 'patient',
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  lastLogin DATETIME DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS labs (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  labCode VARCHAR(64) NOT NULL,
  username VARCHAR(128) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  address LONGTEXT,
  description TEXT,
  services LONGTEXT NOT NULL,
  workingHours LONGTEXT,
  holidays LONGTEXT NOT NULL,
  appointmentDuration INT NOT NULL DEFAULT 30,
  maxAppointmentsPerSlot INT NOT NULL DEFAULT 5,
  admin CHAR(36) DEFAULT NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_labs_labCode (labCode),
  UNIQUE KEY uq_labs_username (username),
  KEY idx_labs_admin (admin),
  CONSTRAINT fk_labs_admin FOREIGN KEY (admin) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS otps (
  id CHAR(36) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  otp VARCHAR(16) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expiresAt DATETIME NOT NULL,
  isVerified TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_otps_phone (phone),
  KEY idx_otps_expiresAt (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointments (
  id CHAR(36) NOT NULL,
  patient CHAR(36) NOT NULL,
  lab CHAR(36) NOT NULL,
  service VARCHAR(255) NOT NULL,
  appointmentDate DATETIME NOT NULL,
  startTime VARCHAR(16) NOT NULL,
  endTime VARCHAR(16) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show') NOT NULL DEFAULT 'pending',
  notes TEXT,
  testResults TEXT,
  isReminderSent TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointments_patient (patient),
  KEY idx_appointments_lab (lab),
  KEY idx_appointments_datetime (appointmentDate, startTime),
  CONSTRAINT fk_appointments_patient FOREIGN KEY (patient) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_appointments_lab FOREIGN KEY (lab) REFERENCES labs (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointment_bookings (
  id CHAR(36) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  patientName VARCHAR(255) DEFAULT '',
  patientAddress TEXT,
  service VARCHAR(255) NOT NULL,
  appointmentDate DATETIME NOT NULL,
  startTime VARCHAR(16) NOT NULL,
  endTime VARCHAR(16) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointment_bookings_phone (phone),
  KEY idx_appointment_bookings_datetime (appointmentDate, startTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS callback_requests (
  id CHAR(36) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  patientName VARCHAR(255) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  service VARCHAR(255) NOT NULL,
  preferredTime ENUM('morning', 'afternoon', 'evening') NOT NULL DEFAULT 'morning',
  preferredDate DATETIME NOT NULL,
  description TEXT,
  status ENUM('pending', 'accepted', 'scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_callback_requests_phone (phone),
  KEY idx_callback_requests_preferredDate (preferredDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sample_collections (
  id CHAR(36) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  patientName VARCHAR(255) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  address LONGTEXT NOT NULL,
  sampleType VARCHAR(255) NOT NULL,
  preferredDate DATETIME NOT NULL,
  preferredTime ENUM('morning', 'afternoon', 'evening') NOT NULL DEFAULT 'morning',
  testName VARCHAR(255) DEFAULT '',
  notes TEXT,
  status ENUM('pending', 'scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  collectionDate DATETIME DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sample_collections_phone (phone),
  KEY idx_sample_collections_preferredDate (preferredDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
