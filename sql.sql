-- 1. Create the database
CREATE DATABASE leave_system;
USE leave_system;

-- 2. Create the Users table (Requirement: User Authentication & Roles [cite: 5, 7])
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL, 
    role ENUM('employee', 'manager') DEFAULT 'employee',
    vacation_balance INT DEFAULT 20, -- (Requirement: Leave Balances [cite: 15])
    sick_balance INT DEFAULT 10
);

-- 3. Create the Leave Requests table (Requirement: Leave Request Submission )
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    leave_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending', -- (Requirement: Approval Workflow [cite: 11])
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Add two test users so you can log in immediately
INSERT INTO users (username, password, role) VALUES 
('john', '1234', 'employee'), 
('boss', '1234', 'manager');