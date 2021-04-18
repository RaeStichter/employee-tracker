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

//rename this to get all employees
// change this from afterConnection to viewAllEmployees
// afterConnection = () => {
viewAllEmployees = () => {
  connection.query('SELECT * FROM employees', function(err, res) {
    if (err) throw err;
    console.log(res);
    //connection.end();
    //getEmployeeById();
  });
};

getEmployeeById = () => {
  connection.query('SELECT * FROM employees WHERE id = 12', function(err, res) {
    if (err) throw err;
    console.log(res);
    //connection.end();
    //createNewEmployee();
  });
};

createNewEmployee = () => {
  var userId = {'first_name': 'Bob', 'last_name':'Test'};
  const sql =  `INSERT INTO employees (first_name, last_name) 
                VALUES (?,?)`;
  const params = [userId.first_name, userId.last_name];

  connection.query(sql, params, function(err, res) {
    if (err) throw err;
    console.log(res);
    //connection.end();
    //afterConnection();
    //connection.end();
    //deleteEmployee();
  });
};

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
      //deleteEmployee();
      break;
    case 'Quit':
      connection.end();
  };
};

whatNext = () => {
  startEmployeeTracker();
};

// // Dependencies
// const express = require('express');
// const mysql = require('mysql2');

// // Port designation
// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());



// // Default response for any other request(Not Found) Catch all
// app.use((req, res) => {
//     res.status(404).end();
// });


// // Listening
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });