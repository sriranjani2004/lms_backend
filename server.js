const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'library-project-sriranjania2004-0677.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_MFT-ZoJunIZRKw_BG8c',
  database: 'defaultdb',
  port: '16947'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS BOOKNAME (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookName VARCHAR(255),
    authorName VARCHAR(255),
    year INT,
    subject VARCHAR(255)
  )
`;


connection.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log('BOOKNAME table created or already exists');
});

app.post('/addBook', (req, res) => {
  const { bookName, authorName, year, subject } = req.body;
  const sql = "INSERT INTO BOOKNAME (bookName, authorName, year, subject) VALUES (?, ?, ?, ?)";
  const values = [bookName, authorName, year, subject];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error inserting book:', error);
      res.status(500).json({ error: 'Error adding book to the database' });
      return;
    }
    console.log('Book inserted successfully');
    res.status(200).json({ message: 'Book added successfully' });
  });
});

app.get('/getBooks', (req, res) => {
  const selectQuery = `SELECT * FROM BOOKNAME`;
  connection.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).json({ error: 'Error fetching books from the database' });
      return;
    }
    console.log('Books fetched from the database');
    res.status(200).json(result);
  });
});

app.delete('/deleteBook', (req, res) => {
  const { bookName, authorName, year, subject } = req.body;
  const deleteQuery = `DELETE FROM BOOKNAME WHERE bookName = ? AND authorName = ? AND year = ? AND subject = ?`;
  connection.query(deleteQuery, [bookName, authorName, year, subject], (err, result) => {
    if (err) {
      console.error('Error deleting book:', err);
      res.status(500).json({ error: 'Error deleting book from the database' });
      return;
    }
    console.log('Book deleted from the database');
    res.status(200).json({ message: 'Book deleted successfully' });
  });
});

app.listen(port, "0.0.0.0",() => {
  console.log(`Server is running on port ${port}`);
});