-- Create database
CREATE DATABASE IF NOT EXISTS u991773587_stomachh DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE u991773587_stomachh;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatarImg INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    doctor_img INT DEFAULT 1,
    bookedDate VARCHAR(100) NOT NULL,
    bookedTime VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    alternativeTime VARCHAR(255) DEFAULT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    match_percentage INT NOT NULL,
    symptoms TEXT, -- Store as JSON or comma separated string
    diagnosis_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    doctor_img VARCHAR(255) DEFAULT NULL,
    is_for_admin BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert a test user (Password: 123456)
INSERT INTO users (name, email, password, avatarImg) 
VALUES ('تجربة', 'test@test.com', '$2y$10$8.a.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o.o', 1)
ON DUPLICATE KEY UPDATE id=id;

-- 1. Organs table
CREATE TABLE IF NOT EXISTS organs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 2. Symptoms table (linked to organs)
CREATE TABLE IF NOT EXISTS symptoms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organ_id INT,
    is_red_flag BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (organ_id) REFERENCES organs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Conditions table
CREATE TABLE IF NOT EXISTS conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    surgery VARCHAR(100),
    test VARCHAR(255),
    treatment TEXT
) ENGINE=InnoDB;

-- 4. Mapping table (Conditions <-> Symptoms)
CREATE TABLE IF NOT EXISTS condition_symptoms (
    condition_id INT,
    symptom_id INT,
    PRIMARY KEY (condition_id, symptom_id),
    FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE
) ENGINE=InnoDB;
