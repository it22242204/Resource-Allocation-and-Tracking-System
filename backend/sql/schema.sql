CREATE DATABASE IF NOT EXISTS resource_allocation;
USE resource_allocation;

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Available', 'In Use', 'Under Maintenance') DEFAULT 'Available',
  category VARCHAR(255)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id INT,
  project_id INT,
  start_time DATETIME,
  end_time DATETIME,
  status ENUM('Available', 'In Use', 'Under Maintenance') DEFAULT 'Available',
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

INSERT INTO resources (name, description, status, category) VALUES
('3D Printer', 'A machine used to produce 3D objects from digital designs', 'Available', 'Equipment'),
('Data Analyst', 'A personnel skilled in interpreting and analyzing data', 'Available', 'Personnel'),
('Mobile Testing Lab', 'A portable lab for testing mobile applications', 'In Use', 'Equipment'),
('Software Testing Suite', 'An integrated suite of tools for testing software', 'Available', 'Software'),
('Web Hosting Server', 'A server used for hosting websites and web applications', 'Under Maintenance', 'Service'),
('Fiber Optic Router', 'A high-speed router for fiber optic networks', 'Available', 'Equipment'),
('Remote Data Backup Service', 'A service for securing and backing up data remotely', 'In Use', 'Service'),
('Technical Support Specialist', 'A personnel assisting with technical issues', 'Available', 'Personnel'),
('AI Model Training Server', 'A server optimized for training AI models', 'Under Maintenance', 'Hardware'),
('Disaster Recovery Solution', 'A service for business continuity and data recovery', 'Available', 'Service');


INSERT INTO projects (name) VALUES
('Project Alpha'),
('Project Beta'),
('Project Gamma');

INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES
(3, 1, '2025-01-01 08:00:00', '2025-01-15 18:00:00', 'In Use'),
(7, 2, '2025-01-05 09:00:00', '2025-01-20 17:00:00', 'In Use'),
(5, 3, '2025-01-10 10:00:00', '2025-01-25 16:00:00', 'Under Maintenance'),
(9, 1, '2025-01-01 08:00:00', '2025-01-15 18:00:00', 'Under Maintenance');

SELECT * FROM resources;
SELECT * FROM projects;
SELECT * FROM allocations;

DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS allocations;