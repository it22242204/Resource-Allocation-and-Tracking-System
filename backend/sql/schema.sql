CREATE DATABASE resource_allocation;
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

DELIMITER //

-- Trigger to update resource status after allocation insert
CREATE TRIGGER update_resource_status_after_insert
AFTER INSERT ON allocations
FOR EACH ROW
BEGIN
  -- If the allocation status is 'In Use', set the resource status to 'In Use'
  IF NEW.status = 'In Use' THEN
    UPDATE resources
    SET status = 'In Use'
    WHERE id = NEW.resource_id;
  END IF;
END //

-- Trigger to update resource status after allocation update
CREATE TRIGGER update_resource_status_after_update
AFTER UPDATE ON allocations
FOR EACH ROW
BEGIN
  -- Update resource status to match the allocation status
  IF NEW.status = 'In Use' THEN
    UPDATE resources
    SET status = 'In Use'
    WHERE id = NEW.resource_id;
  ELSEIF NEW.status = 'Available' THEN
    -- Check if there are other active allocations for the resource
    IF NOT EXISTS (
      SELECT 1
      FROM allocations
      WHERE resource_id = NEW.resource_id AND status = 'In Use'
    ) THEN
      UPDATE resources
      SET status = 'Available'
      WHERE id = NEW.resource_id;
    END IF;
  END IF;
END //

-- Trigger to update resource status after allocation delete
CREATE TRIGGER update_resource_status_after_delete
AFTER DELETE ON allocations
FOR EACH ROW
BEGIN
  -- Check if there are any other active allocations for the resource
  IF NOT EXISTS (
    SELECT 1
    FROM allocations
    WHERE resource_id = OLD.resource_id AND status = 'In Use'
  ) THEN
    UPDATE resources
    SET status = 'Available'
    WHERE id = OLD.resource_id;
  END IF;
END //

DELIMITER ;
