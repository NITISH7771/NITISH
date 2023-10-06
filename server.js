const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'registration_db',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Middleware to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve registration page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/registration.html');
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const {
        fullname,
        email,
        username,
        password,
        mobile,
        dob,
        gender,
        qualification,
    } = req.body;

    // Insert the submitted data into the database
    const insertQuery = `INSERT INTO users (fullname, email, username, password, mobile, dob, gender, qualification) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        insertQuery,
        [fullname, email, username, password, mobile, dob, gender, qualification],
        (err, results) => {
            if (err) {
                console.error('Database error: ' + err.stack);
                return res.status(500).send('Error during registration');
            }

            res.send(
                `<h2>Registration Successful!</h2>
                 <p>Thank you for registering with the following details:</p>
                 <table>
                     <tr><th>Field</th><th>Value</th></tr>
                     <tr><td>Full Name</td><td>${fullname}</td></tr>
                     <tr><td>Email</td><td>${email}</td></tr>
                     <tr><td>Username</td><td>${username}</td></tr>
                     <tr><td>Mobile</td><td>${mobile}</td></tr>
                     <tr><td>Date of Birth</td><td>${dob}</td></tr>
                     <tr><td>Gender</td><td>${gender}</td></tr>
                     <tr><td>Qualification</td><td>${qualification}</td></tr>
                 </table>`
            );
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});