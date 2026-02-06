const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// FIXED: This line tells the server to look in the CURRENT folder for index.html
app.use(express.static('public'));

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Leeladrireddy@13',  // <--- YOUR PASSWORD IS HERE
    database: 'leave_system'
});

db.connect(err => {
    if (err) console.log('DB Connection Failed: ' + err);
    else console.log('MySQL Connected...');
});

// --- API ROUTES ---

// 1. LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) res.json({ success: true, user: result[0] });
        else res.json({ success: false });
    });
});

// 2. SUBMIT REQUEST
app.post('/request', (req, res) => {
    const { user_id, type, start, end, reason } = req.body;
    const sql = 'INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason) VALUES (?,?,?,?,?)';
    db.query(sql, [user_id, type, start, end, reason], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// 3. GET ALL LEAVES (With Usernames)
app.get('/leaves', (req, res) => {
    const sql = 'SELECT leave_requests.*, users.username FROM leave_requests JOIN users ON leave_requests.user_id = users.id';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 4. APPROVE/REJECT (With Balance Logic)
app.post('/update-status', (req, res) => {
    const { id, status, user_id, type, days } = req.body;

    // First, update the status
    db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, id], (err, result) => {
        if (err) throw err;

        // If Approved, subtract days from balance
        if (status === 'Approved') {
            const column = (type === 'Vacation') ? 'vacation_balance' : 'sick_balance';
            const sqlBalance = `UPDATE users SET ${column} = ${column} - ? WHERE id = ?`;
            
            db.query(sqlBalance, [days, user_id], (err2) => {
                if (err2) throw err2;
                res.json({ success: true });
            });
        } else {
            res.json({ success: true });
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});