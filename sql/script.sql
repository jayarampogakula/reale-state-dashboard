-- ======================================
-- Database: telecaller
-- ======================================

-- 1. Companies Table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin','companyadmin','agent') NOT NULL DEFAULT 'agent',
    company_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 3. Leads Table
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    budget VARCHAR(50),
    timeline VARCHAR(50),         -- e.g. "3 months", "immediate"
    status ENUM('New','Hot','Warm','Cold','Closed') DEFAULT 'New',
    outcome VARCHAR(255),
    transcript TEXT,

    -- Relations
    company_id INT NOT NULL,
    assigned_to INT NULL,         -- user_id of agent
    site_visit_date DATETIME NULL,
    payment_due_date DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for fast lookups
CREATE INDEX idx_leads_company ON leads(company_id);
CREATE INDEX idx_leads_agent ON leads(assigned_to);

-- ======================================
-- Initial Data (Super Admin)
-- ======================================
INSERT INTO users (username, password_hash, role)
VALUES (
    'superadmin',
    -- Password = "admin123" (change later)
    '$2y$10$H9cvW4hT4zH4Kn8Y9V7UQOT1XoX1mVWxuP/BuWc8SX1s7htJQmJFG',
    'superadmin'
);
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    price_range VARCHAR(100),
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE leads ADD COLUMN project_id INT NULL;

ALTER TABLE leads
  ADD CONSTRAINT fk_lead_project
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
