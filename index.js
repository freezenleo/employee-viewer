const inquirer = require('inquirer');
const db = require('./db/connection');

const cTable = require('console.table');

const { end } = require('./db/connection');


//init list of dpeartment names, manager names, employee names, and role names
let departmentResult = [];
let managerResult = ['0 none'];
const employeesResult = [];
let roleResult = [];

console.log(`
    ===========================================
                Employee Manager
    ===========================================
    `);


const promptUser = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'todo',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department',
                'View all employees by manager', 'View department list', 'View role list', 'Add employee', 'Remove employee',
                'Update employee role', 'Update employee manager', 'Add department', 'Remove department',
                'Remove role', 'Add role', 'View total utilized budget by department', 'Quit']
        }
    ])
        .then(todo => {

            if (todo.todo === 'View all employees') {
                const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                FROM employee 
                LEFT JOIN role on employee.role_id = role.id 
                LEFT JOIN department on role.department_id = department.id 
                LEFT JOIN employee manager on manager.id = employee.manager_id;`;

                db.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log("\n");
                    console.table(result);
                    promptUser();
                });
            }

            else if (todo.todo === 'View all employees by department') {
                const sql = `SELECT CONCAT(id, ' ', name) AS name from department`;
                const newDep = [];
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    Object.keys(result).forEach(function (key) {
                        var row = result[key];
                        newDep.push(row.name);
                    });

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: 'Which department employees do you want to see?',
                            choices: newDep
                        }
                    ])
                        .then(data => {
                            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title
                    FROM employee
                    LEFT JOIN role on employee.role_id = role.id
                    LEFT JOIN department on role.department_id = department.id
                    WHERE department.id = ?;`

                            let departmentId = [];
                            departmentId = data.department.split(' ');
                            db.query(sql, departmentId[0], (err, result) => {
                                if (err) throw err;
                                console.table(result);
                                promptUser()
                            })
                        })
                })
            }

            else if (todo.todo === 'View all employees by manager') {
                const sql = `SELECT CONCAT(id, ' ', first_name, ' ', last_name) AS manager_name
                FROM employee 
                WHERE manager_id is NULL;`;
                const newManager = [];
                db.query(sql, (err, result) => {
                    console.log('new', newManager);
                    if (err) throw err;
                    Object.keys(result).forEach(function (key) {
                        var row = result[key];
                        newManager.push(row.manager_name);
                    })

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'managerName',
                            message: `Which employee do you want to see direct reports for?`,
                            choices: newManager
                        }
                    ])
                        .then(employeeData => {
                            const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
                                    FROM employee
                                    LEFT JOIN role on employee.role_id = role.id
                                    LEFT JOIN department on role.department_id = department.id
                                    WHERE manager_id = ?;`;

                            let managerId = [];
                            managerId = employeeData.managerName.split(' ');

                            if (managerId[0] <= 0) {
                                console.log("\n");
                                console.log('No manager for this employee');
                                promptUser();
                            }
                            else {
                                db.query(sql, managerId[0], (err, result) => {
                                    if (err) throw err;
                                    console.log("\n");
                                    console.table(result);
                                    promptUser();
                                })
                            }
                        })
                })
            }

            else if (todo.todo === 'View department list') {
                const sql = `SELECT * FROM department`;

                db.query(sql, (err, result) => {
                    console.log('\n');
                    console.table(result);
                    promptUser();
                })
            }

            else if (todo.todo === 'View role list') {
                const sql = `SELECT * FROM role`;

                db.query(sql, (err, result) => {
                    console.log('\n');
                    console.table(result);
                    promptUser();
                })
            }

            else if (todo.todo === 'Add employee') {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: `What is the employee's first name?`
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: `What is the employee's last name?`
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `What is the employee's role?`,
                        choices: roleResult
                    },
                    {
                        type: 'list',
                        name: 'managerName',
                        message: `Who is the employee's manager?`,
                        choices: managerResult
                    }
                ])
                    .then(employeeData => {
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES
                                        (?,?,?,?);`;
                        let roleId = [];
                        let managerId = [];

                        roleId = employeeData.role.split(' ');
                        managerId = employeeData.managerName.split(' ');

                        if (managerId[0] === '0') {
                            const params = [employeeData.firstName, employeeData.lastName, roleId[0], null];

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("\n");
                                console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database`);
                                promptUser();
                            })
                        }
                        else {
                            console.log('role', managerId[0]);
                            const params = [employeeData.firstName, employeeData.lastName, roleId[0], managerId[0]];
                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("\n");
                                console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database`);
                                promptUser();
                            })
                        }
                    })
            }

            else if (todo.todo === 'Remove employee') {
                const sql = `SELECT CONCAT(id, ' ', first_name, ' ', last_name) AS name FROM employee;`;
                let employeeRemove = [];
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    Object.keys(result).forEach(function (key) {
                        var row = result[key];
                        employeeRemove.push(row.name);
                    })

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'name',
                            message: 'Which employee do you want to remove?',
                            choices: employeeRemove
                        }
                    ])
                        .then(employeeData => {
                            let str = [];
                            str = employeeData.name.split(' ');
                            const sql = `DELETE FROM employee WHERE employee.id = ${str[0]};`;

                            db.query(sql, (err, result) => {
                                if (err) throw err;
                                console.log("\n");
                                console.log(`Deleted ${employeeData.name} form the database`);
                                promptUser();
                            })

                        })
                })
            }

            else if (todo.todo === 'Update employee role') {
                console.log('rolelist', roleResult);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'Which employee do you want to update role?',
                        choices: employeesResult
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to update to?',
                        choices: roleResult
                    }
                ])
                    .then(employeeData => {
                        let employeeId = [];
                        let roleId = [];
                        employeeId = employeeData.name.split(' ');
                        roleId = employeeData.role.split(' ');


                        const sql = `UPDATE employee SET role_id = ${roleId[0]} WHERE employee.id = ${employeeId[0]};`;
                        console.log('person', sql);
                        db.query(sql, (err, result) => {
                            if (err) throw err;
                            console.log("\n");
                            console.log(`Updated ${employeeData.name} role to ${employeeData.role} in the database`);
                            promptUser();
                        })
                    })
            }

            else if (todo.todo === 'Update employee manager') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'name',
                        message: 'Which employee do you want to update role?',
                        choices: employeesResult
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager do you want to update to for this employee?',
                        choices: managerResult
                    }
                ])
                    .then(employeeData => {
                        let employeeId = [];
                        let managerId = [];
                        employeeId = employeeData.name.split(' ');
                        managerId = employeeData.manager.split(' ');

                        const sql = `UPDATE employee SET manager_id = ${managerId[0]} WHERE employee.id = ${employeeId[0]};`;

                        db.query(sql, (err, result) => {
                            if (err) throw err;
                            console.log("\n");
                            console.log(`Updated ${employeeData.name} manager to ${employeeData.manager}form the database`);
                            promptUser();
                        })
                    })
            }

            else if (todo.todo === 'Add department') {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'addDepartment',
                        message: 'What department do you want to add?'
                    }
                ])
                    .then(departmentData => {
                        const sql = `INSERT INTO department (name)
                                    VALUES (?);`;

                        const params = [departmentData.addDepartment];
                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('\n');
                            console.log(`Added ${departmentData.addDepartment} to department table`);

                            promptUser();
                        })
                    })
            }

            else if (todo.todo === 'Remove department') {
                const sql = `SELECT CONCAT(id, ' ', name) AS name from department`;
                const newDep = [];
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    Object.keys(result).forEach(function (key) {
                        var row = result[key];
                        newDep.push(row.name);
                    });

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: 'What department do you want to remove?',
                            choices: newDep
                        }
                    ])
                        .then(departmentData => {
                            let departmentId = [];
                            departmentId = departmentData.department.split(' ');

                            const sql = `DELETE FROM department WHERE id = ${departmentId[0]};`;

                            db.query(sql, (err, result) => {
                                if (err) throw err;
                                console.log("\n");
                                console.log(`Deleted ${departmentData.department} from department table`);
                                promptUser();
                            })
                        })
                })
            }

            else if (todo.todo === 'Remove role') {
                console.log('removerole', roleResult);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What role do you want to remove?',
                        choices: roleResult
                    }
                ])
                    .then(roleData => {
                        let roleId = [];
                        roleId = roleData.role.split(' ');

                        const sql = `DELETE FROM role WHERE id = ${roleId[0]};`;

                        db.query(sql, (err, result) => {
                            if (err) throw err;
                            console.log("\n");
                            console.log(`Deleted ${roleData.role} from role table`);
                            promptUser();
                        })
                    })
            }

            else if (todo.todo === 'Add role') {

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What role do you want to add?'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does this role belong to?',
                        choices: departmentResult
                    }
                ])
                    .then(roleData => {
                        const sql = `INSERT INTO role (title, salary, department_id)
                                    VALUES (?,?,?);`;

                        let departmentId = [];
                        departmentId = roleData.department.split(' ');

                        const params = [roleData.role, roleData.salary, roleData.department[0]];
                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("\n");
                            console.log(`Added ${roleData.role} to role table`);
                            promptUser();
                        })
                    })

            }

            else if (todo.todo === 'View total utilized budget by department') {
                const sql = `SELECT department.name AS department, SUM(role.salary) AS total_salary
                                    FROM employee
                                    LEFT JOIN role on employee.role_id = role.id
                                    LEFT JOIN department on role.department_id = department.id
                                    GROUP by department_id;`;

                db.query(sql, (err, result) => {
                    if (err) throw err;
                    console.table(result);
                    promptUser();
                })
            }

            else if (todo.todo === 'Quit') {
                db.end();
            }
        })

}


//get a list of department name in an array
function departmentName() {
    const sql = `SELECT CONCAT(id, ' ', name) AS name from department`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            departmentResult.push(row.name);
        });
    })
}
departmentName();

//get a list of manager in an array
const viewByManager = () => {
    const sql = `SELECT CONCAT(id, ' ', first_name, ' ', last_name) AS manager_name
                FROM employee 
                WHERE manager_id is NULL;`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            managerResult.push(row.manager_name);
        })
    })
}
viewByManager();

//get employee roles array
const roleList = () => {
    const sql = `SELECT CONCAT(id, ' ', title) AS title From role`;

    db.query(sql, (err, result) => {
        if (err) throw err;

        Object.keys(result).forEach(function (key) {
            var row = result[key];
            roleResult.push(row.title);
        })
    })
}
roleList();

// get a list of employees
const employeesList = () => {
    const sql = `SELECT CONCAT(id, ' ', first_name, ' ', last_name) AS name FROM employee;`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            employeesResult.push(row.name);
        })
    })
}
employeesList();



//init the starting prompt
promptUser();

//connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
})