INSERT INTO departments (name)
VALUES
('Research and Development'),
('Manufacturing'),
('Quality'),
('Procurement');




INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, NULL),
  ('Virginia', 'Woolf', 2, NULL),
  ('Piers', 'Gaveston', 3, NULL),
  ('Charles', 'LeRoi', 4, NULL),
  ('Katherine', 'Mansfield', 5, NULL),
  ('Dora', 'Carrington', 6, NULL),
  ('Edward', 'Bellamy', 7, NULL),
  ('Montague', 'Summers', 8, NULL),
  ('Octavia', 'Butler', 9, NULL),
  ('Unica', 'Zurn', 10, NULL);



INSERT INTO roles (title, salary, department_id)
VALUES
('R&D Engineer', 70000, 1),
('Senior R&D Engineer', 90000, 1),
('R&D Manager', 120000, 1),
('Technician', 45000, 2),
('Manufacturing Engineer', 70000, 2),
('Manufacturing Director', 130000, 2),
('Design Quality Engineer', 80000, 3),
('Site Quality Engineer', 75000, 3),
('Quality Director', 140000, 3),
('Purchasing Speciality', 70000, 4);

