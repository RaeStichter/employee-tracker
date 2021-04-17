// get the client
const mysql = require('mysql2');

// allow for prompts
const inquirer = require('inquirer');

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
      'View All Employees',
      'View One Emplyeee by ID',
      'Create New Employee',
      'Delete Employee'
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




// option handler to tell the program where to reference functions
function optionHandler(options) {
  switch(options) {
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'View One Emplyeee by ID':
      getEmployeeById();
      break;
    case 'Create New Employee':
      createNewEmployee();
      break;
    case 'Delete Employee':
      deleteEmployee();
      break;
  };
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