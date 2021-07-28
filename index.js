const inquirer = require('inquirer');
const db = require('./db/connection');

const cTable = require('console.table');

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
                return viewAll();
            }
            else if (todo.todo === 'View all employees by department') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department employees do you want to see?',
                        choices: []
                    }
                ])
            }
        })
}

const viewAll = () => {
    const sql = `SELECT * FROM employee`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    });
};

const viewByDepartment = () => {
    const sql = `S`
}

promptUser();

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
})