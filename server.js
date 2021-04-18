// get the client
const mysql = require('mysql2');

// allow for prompts
const inquirer = require('inquirer');

// table view
const cTable = require('console.table')

// hide db info
require("dotenv").config();

// Creates the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 3306,
  database: 'trackerDB'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  startEmployeeTracker();
});

// list of questions for promptQuestions
const promptQuestions = [
  {
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'Quit'
    ]
  }
]

// begin the prompts from inquirer
startEmployeeTracker = () => {
  return inquirer.prompt(promptQuestions)
  .then((data) => {
    optionHandler(data.options);
  });
};


// -------------------------- View All Departments --------------------------

viewAllDepartments = () => {
  connection.query('SELECT * FROM departments',
    function(err, res) {
      if (err) throw err;
      tableResults(res);
      whatNext();
  });
};

// -------------------------- View All Roles --------------------------

viewAllRoles = () => {
  connection.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id',
  function(err, res) {
    if (err) throw err;
    tableResults(res);
    whatNext();
  });
};

// -------------------------- View All Employees --------------------------

viewAllEmployees = () => {
  connection.query(
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, roles.salary AS salary, departments.name AS department, manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id', 
      function (err, res) {
        if (err) throw err;
        tableResults(res);
        whatNext();
      })
}

// -------------------------- Add A Department --------------------------

addDepartment = () => {
  inquirer.prompt(
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the Department you would like to add?'
    }
  )
  .then((data) => {
    connection.query('INSERT INTO departments SET ?', {
      name: data.department
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + ' department was added!\n');
      whatNext();
    });
  });
}

// -------------------------- Add A Role --------------------------

addRole = () => {
  var departments = [];
  connection.query('SELECT * FROM departments', function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }
  });
  
  return inquirer.prompt([ 
    {
      type: 'input',
      name: 'role_title',
      message: 'What is the title of the role would you like to add?',
    },
    {
      type: 'input',
      name: 'role_salary',
      message: 'What is the salary of the role?'
    },
    {
      type: 'list',
      name: 'role_department',
      message: 'What deartment would you like to add the role to?',
      choices: departments
    }
  ])

  .then((data) => {
    connection.query('SELECT id FROM departments WHERE name =?',
    [
      data.role_department
    ],
    function (err, res) {
      if (err) throw err;
      var departmentId = res[0].id
      
      connection.query('INSERT INTO roles SET ?,?,?',
        [
          {
            title: data.role_title
          },
          {   
            salary: data.role_salary
          },
          {   
            department_id: departmentId
          }
        ],
      function (err, res) {
        if (err) throw err;
          console.log(res.affectedRows + ' role added!\n');
          whatNext();
      });
    });
  }
)};

// -------------------------- Add an Employee --------------------------

createNewEmployee = () => {
  var roles = [];
    connection.query('SELECT title FROM roles', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    });

    var managers = [];
    connection.query('SELECT CONCAT( first_name, " ", last_name ) AS full_name FROM employees', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managers.push(res[i].full_name);
        }
    });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'What is the first name of the employee you would like to add?',
        },
        {
            type: 'input',
            name: 'employee_last_name',
            message: 'What is the last name of the employee you would like to add?',
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'What is the role of the employee you would like to add?',
            choices: roles
        },
        {
            type: 'list',
            name: 'employee_manager',
            message: 'Who is the manager of the employee you would like to add?',
            choices: managers
        },
    ])
    .then((data) => {
        connection.query('SELECT id FROM roles WHERE title =?; SELECT id FROM employees WHERE CONCAT( first_name, " ", last_name ) =?',
        [
            data.employee_role,
            data.employee_manager
        ],
        function (err, res) {
            if (err) throw err;
            var roleId = res[0][0].id;
            var managerId = res[1][0].id;
        
            connection.query('INSERT INTO employees SET ?,?,?,?',
            [{
                first_name: data.employee_first_name
            },
            {   last_name: data.employee_last_name
            },
            {   role_id: roleId
            },
            {   manager_id: managerId
            }],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' employee added!\n');
      });
    }); 
    });
}

// -------------------------- Update an Employee --------------------------

function updateEmployeeRole() {
  var roles = [];
  connection.query('SELECT title FROM roles', function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
          roles.push(res[i].title);
      }
  });

  var employees = [];
  connection.query('SELECT CONCAT( first_name, " ", last_name ) AS full_name FROM employees', function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
          employees.push(res[i].full_name);
      }
  

  return inquirer.prompt([
      {
          type: 'list',
          name: 'employee_update',
          message: 'Which employee would you like to update?',
          choices: employees
      },
      {
          type: 'list',
          name: 'employee_role',
          message: 'What would you like to update this employees role to?',
          choices: roles
      },
  ])
  .then((data) => {
      connection.query('SELECT id FROM roles WHERE title =?; SELECT id FROM employees WHERE CONCAT( first_name, " ", last_name ) =?', 
      [
          data.employee_role,
          data.employee_update
      ],
      function (err, res) {
          if (err) throw err;
          var roleId = res[0][0].id;
          var employeeId = res[1][0].id;

          connection.query('UPDATE employees SET ? WHERE ?',
          [{
              role_id: roleId
          },
          {
              id: employeeId
          }
          ],
          function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + ' employee role update!\n');
          }
          )
    });
    });
  });
}

deleteEmployee = () => {
  var userId = {'id': 14};
  const sql =  `DELETE FROM employees WHERE id = ?`;
  const params = [userId.id];

  connection.query(sql, params, function(err, res) {
    if (err) throw err;
    console.log(res, userId.id, "deleted this id");
    //connection.end();
    //afterConnection();
    //connection.end();
  });
};

// Show the results in table form
const tableResults = (results => {
  res = cTable.getTable(results)
  console.log(res)
})


// option handler to tell the program where to reference functions
function optionHandler(options) {
  switch(options) {
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'View All Roles':
      viewAllRoles();
      break;
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'Add a Department':
      addDepartment();
      break;
    case 'Add a Role':
      addRole();
      break;
    case 'Add an Employee':
      createNewEmployee();
      break;
    case 'Update an Employee Role':
      updateEmployeeRole();
      break;
    case 'Quit':
      connection.end();
  };
};

whatNext = () => {
  startEmployeeTracker();
};
