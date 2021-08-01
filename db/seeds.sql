USE employeeviewer;

INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Manager', 100000, 1),
('Engineering Manager', 150000, 2),
('Finance Manager', 120000, 3),
('Legal Team Manager', 200000, 4),
('Salesperson', 60000, 1),
('Engineer', 80000,2),
('Accountant', 80000, 3),
('Lawyer', 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('James', 'Fraser', 1, NULL),
('Jack', 'London', 2, NULL),
('Robert', 'Bruce', 3, NULL),
('Peter', 'Greenaway', 4, NUll),
('Derek', 'Jarman', 5, 1),
('Paolo', 'Pasolini',5, 1),
('Heathcote', 'Williams', 6, 2),
('Sandy', 'Powell', 7, 3),
('Emil', 'Zola', 8, 4),
('Sissy', 'Coalpits', 8, 4);