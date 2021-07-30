# employee-viewer

SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id 
    LEFT JOIN department ON department.id = role.department_id;


select employee.id, employee.first_name, concat(first_name, ' ', last_name) AS manager
from employee
left join employee on employee.manager_id = employee.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee LEFT JOIN role on employee.role_id = role.id 
LEFT JOIN department on role.department_id = department.id 
LEFT JOIN employee manager on manager.id = employee.manager_id;

What would you like to do ? (use arrow keys)
View all employees
View all employees by department
View all employees by manager
Add employee
Remove employee
Update employee role
Update employee manager
Add department
Remove department
View all roles
Remove role
Add role
View total utilized budget by department
Quit 

After view by manager
Which employee do you want to see direct reports for? (use arrow keys)

Add employee 
What is the employee’s first name?
What is the employee’s last name?
What is the employee’s role?(use arrow keys)
List of roles
Who is the employee’s manager? (use arrow keys to pick a manager)
	Console.log added to database

Update role
Which empolyee’s role do you want to update? (use arrow keys)
Which role do you want to assign the selected employee? (use arrow keys)
Console.log Updated employee’s role

Remove employee
Which employee do you want to remove? (use arrow keys)
	Console.log removed employee from the database

Quit the terminal





















WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

