const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Chat backend is running!');
});

app.get('/messages', (req, res) => {
  const sql = `
    SELECT m.id, u.username, u.avatar, m.message, m.timestamp
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.timestamp ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.post('/messages', (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({ error: 'Username and message are required' });
  }


  const findUser = 'SELECT id, avatar FROM users WHERE username = ?';
  db.query(findUser, [username], (err, userResults) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (userResults.length > 0) {
      insertMessage(userResults[0].id);
    } else {
      
      const insertUser = 'INSERT INTO users (username) VALUES (?)';
      db.query(insertUser, [username], (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ error: "Database error" });
        }
        insertMessage(result.insertId);
      });
    }
  });

  
  function insertMessage(userId) {
    const insertMsg = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
    db.query(insertMsg, [userId, message], (err, result) => {
      if (err) {
        console.error("Error inserting message:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const getMsg = `
        SELECT m.id, u.username, u.avatar, m.message, m.timestamp
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `;
      db.query(getMsg, [result.insertId], (err, rows) => {
        if (err) {
          console.error("Error fetching inserted message:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json(rows[0]);
      });
    });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
