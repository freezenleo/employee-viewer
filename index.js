const inquirer = require('inquirer');
const db = require('./db/connection');

const cTable = require('console.table');

let departmentResult = [];
let managerResult = [];
// let managerNone = managerResult;
managerResult.push('None');
console.log(managerResult);
// console.log('here', managerNone);
let roleResult = [];

const promptUser = () => {
    console.log(`
    ===========================================
                Employee Manager
    ===========================================
    `);

    return inquirer.prompt([
        {
            type: 'list',
            name: 'todo',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department',
                'View all employees by manager', 'Add employee', 'Remove employee',
                'Update employee role', 'Update employee manager', 'Add department', 'Remove department',
                'Remove role', 'Add role', 'View total utilized budget by department', 'Quit']
        }
    ])
        .then(todo => {
            if (todo.todo === 'View all employees') {
                viewAll();
                promptUser();
            }

            else if (todo.todo === 'View all employees by department') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department employees do you want to see?',
                        choices: departmentResult
                    }
                ])
                    .then(data => {
                        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title
                    FROM employee
                    LEFT JOIN role on employee.role_id = role.id
                    LEFT JOIN department on role.department_id = department.id
                    WHERE department.id = ?;`
                        let index = departmentResult.indexOf(data.department) + 1;
                        db.query(sql, index, (err, result) => {
                            if (err) throw err;
                            console.table(result);
                        })
                    })
                    .then(() => promptUser());
            }

            else if (todo.todo === 'View all employees by manager') {
                console.log(managerResult);
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'managerName',
                        message: `Which employee do you want to see direct reports for?`,
                        choices: managerResult
                    }
                ])
                    .then(data => {
                        console.log('pass', data);
                        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department
                                    FROM employee
                                    LEFT JOIN role on employee.role_id = role.id
                                    LEFT JOIN department on role.department_id = department.id
                                    WHERE manager_id = ?;`;

                        let index = managerResult.indexOf(data.managerName) + 1;

                        console.log('number', index);
                        db.query(sql, index, (err, result) => {
                            if (err) throw err;
                            console.table(result);
                        })
                    })
                    .then(() => promptUser());
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
                        choices: managerNone
                    }
                ])
                    .then(employeeData => {
                        console.log(employeeData);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES
                                        (?,?,?,?);`;
                        let managerIndex = managerResult.indexOf(employeeData.managerName) + 1;
                        let roleIndex = roleResult.indexOf(employeeData.role) + 1;
                        if (managerIndex < 5) {
                            const params = [employeeData.firstName, employeeData.lastName, roleIndex, managerIndex];
                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database`)
                            })
                        }
                        else {
                            const params = [employeeData.firstName, employeeData.lastName, roleIndex, NULL];
                            console.log('params', params);
                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log(`Added ${employeeData.firstName} ${employeeData.lastName} to the database`)
                            })
                        }
                    })
                    .then(() => promptUser());
            }

            else if (todo.todo === 'Remove employee') {

            }

            else if (todo.todo === 'Update employee role') {

            }

            else if (todo.todo === 'Update employee manager') {

            }

            else if (todo.todo === 'Add department') {

            }

            else if (todo.todo === 'Remove department') {

            }
        })
}

//get all employees info
const viewAll = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                FROM employee 
                LEFT JOIN role on employee.role_id = role.id 
                LEFT JOIN department on role.department_id = department.id 
                LEFT JOIN employee manager on manager.id = employee.manager_id;`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });
};

//get a list of department name in an array
const departmentName = () => {
    const sql = `SELECT name from department`;

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
    const sql = `SELECT CONCAT(first_name, ' ', last_name) AS manager_name
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
    const sql = `SELECT title From role`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            roleResult.push(row.title);
        })
    })
}
roleList();



promptUser();

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
})