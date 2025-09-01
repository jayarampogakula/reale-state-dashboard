-- ======================================
-- SAMPLE DATA FOR DEMO
-- ======================================

-- Insert Companies
INSERT INTO companies (name) VALUES
('Dream Homes Pvt Ltd'),
('Skyline Realty');

-- Insert Company Admins
INSERT INTO users (username, password_hash, role, company_id) VALUES
('dream_admin', '$2y$10$6yoD5I6xX3B8s2/3OByQ7uVj/nxtcWd8PavjLOQJX5Huh2RzI1vPq', 'companyadmin', 1),
('skyline_admin', '$2y$10$6yoD5I6xX3B8s2/3OByQ7uVj/nxtcWd8PavjLOQJX5Huh2RzI1vPq', 'companyadmin', 2);

-- Password = "admin123" (for both, change later)

-- Insert Agents for Dream Homes
INSERT INTO users (username, password_hash, role, company_id) VALUES
('ramesh', '$2y$10$w7iX.x8E0H4E6klBlU2lyu.mFG2q3TDxoeAfWAVy/78BdMWkJTwPm', 'agent', 1),
('anita', '$2y$10$w7iX.x8E0H4E6klBlU2lyu.mFG2q3TDxoeAfWAVy/78BdMWkJTwPm', 'agent', 1);

-- Insert Agents for Skyline Realty
INSERT INTO users (username, password_hash, role, company_id) VALUES
('vivek', '$2y$10$w7iX.x8E0H4E6klBlU2lyu.mFG2q3TDxoeAfWAVy/78BdMWkJTwPm', 'agent', 2),
('priya', '$2y$10$w7iX.x8E0H4E6klBlU2lyu.mFG2q3TDxoeAfWAVy/78BdMWkJTwPm', 'agent', 2);

-- Password = "agent123" for all agents

-- Insert Leads for Dream Homes
INSERT INTO leads (name, phone, budget, timeline, status, outcome, company_id, assigned_to, site_visit_date, payment_due_date)
VALUES
('Ankit Sharma', '+919812345678', '80L', '<3 months', 'Hot', 'Buyer confirmed visit', 1, 2, '2025-09-05 16:00:00', NULL),
('Meena Rani', '+919876543210', '55L', '6 months+', 'Cold', 'Not interested currently', 1, 1, NULL, NULL),
('John Dsouza', '+918888888888', '70L', '3-6 months', 'Warm', 'Asked to call back later', 1, 1, NULL, NULL),
('Ravi Kumar', '+917777777777', '95L', '<3 months', 'Hot', 'Site Visit Scheduled', 1, 2, '2025-09-07 11:00:00', NULL),
('Kiran Patel', '+916666666666', '60L', 'Immediate', 'Closed', 'Deal finalised', 1, 2, NULL, '2025-09-15 00:00:00');

-- Insert Leads for Skyline Realty
INSERT INTO leads (name, phone, budget, timeline, status, outcome, company_id, assigned_to, site_visit_date, payment_due_date)
VALUES
('Suresh Singh', '+915555555555', '85L', '<3 months', 'Hot', 'Interested in 3BHK', 2, 3, '2025-09-06 15:00:00', NULL),
('Priya Malhotra', '+914444444444', '50L', '6 months+', 'Cold', 'Not ready now', 2, 4, NULL, NULL),
('Rahul Verma', '+913333333333', '75L', 'Immediate', 'Hot', 'Site visit pending confirmation', 2, 3, NULL, NULL),
('Sneha Iyer', '+912222222222', '90L', '<3 months', 'Warm', 'Looking for loan options', 2, 4, NULL, NULL),
('Arjun Mehta', '+911111111111', '65L', '3-6 months', 'New', 'Fresh enquiry', 2, 4, NULL, NULL);
