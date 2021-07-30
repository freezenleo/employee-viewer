const inquirer = require('inquirer');
const db = require('./db/connection');

const cTable = require('console.table');

let departmentResult = [];

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
                departmentName();
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department employees do you want to see?',
                        choices: departmentResult
                    }
                ])
            }
            else if (todo.todo === 'View all employees by manager') {
                departmentName();
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'lastName',
                        message: `Which employee do you want to see direct reports for?`,
                        choices: departmentResult
                    }
                ])
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
                        choices: []
                    },
                    {
                        type: 'list',
                        name: 'lastName',
                        message: `Who is the employee's manager?`,
                        choices: []
                    },
                ])
            }
            // else if (todo.todo === )
        })
}

const viewAll = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON department.id = role.department_id;`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });
};

const departmentName = () => {
    const sql = `SELECT name from department`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            departmentResult.push(row.name);
        });
        console.log(departmentResult);
    })
}


// const viewByDepartment = () => {
//     const sql = `S`
// }

promptUser();

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
})