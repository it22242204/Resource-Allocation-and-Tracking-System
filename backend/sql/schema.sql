CREATE DATABASE resource_allocation;
USE resource_allocation;

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Available', 'In Use', 'Under Maintenance') DEFAULT 'Available',
  category VARCHAR(255)
);

CREATE TABLE allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id INT,
  project_id INT,
  start_time DATETIME,
  end_time DATETIME,
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
