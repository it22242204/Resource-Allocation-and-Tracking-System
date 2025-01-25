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
('Resource 1', 'High-performance server', 'Available', 'Hardware'),
('Resource 2', 'Database server', 'Available', 'Hardware'),
('Resource 3', 'Development workstation', 'In Use', 'Hardware'),
('Resource 4', 'QA environment', 'Available', 'Software'),
('Resource 5', 'Production server', 'Under Maintenance', 'Hardware'),
('Resource 6', 'Network switch', 'Available', 'Hardware'),
('Resource 7', 'Cloud storage service', 'In Use', 'Service'),
('Resource 8', 'Email server', 'Available', 'Service'),
('Resource 9', 'Load balancer', 'Under Maintenance', 'Hardware'),
('Resource 10', 'Backup solution', 'Available', 'Service');

INSERT INTO projects (name) VALUES
('Project Alpha'),
('Project Beta'),
('Project Gamma');

INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES
(3, 1, '2025-01-01 08:00:00', '2025-01-15 18:00:00', 'In Use'),
(7, 2, '2025-01-05 09:00:00', '2025-01-20 17:00:00', 'In Use'),
(5, 3, '2025-01-10 10:00:00', '2025-01-25 16:00:00', 'Under Maintenance');

SELECT * FROM resources;
SELECT * FROM projects;
SELECT * FROM allocations;

DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS allocations;