# employee-viewer

select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
    from employee
    left join role on role.id = employee.role_id 
    left join department on department.id = role.department_id;




select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, employee.first_name AS manager
from employee
left join department on department.id = role.department_id
left join role on role.id = employee.role_id
left join employee on employee.manager_id = employee.id;