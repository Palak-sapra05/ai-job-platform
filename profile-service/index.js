const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3002;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'profile_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/health', (req, res) => res.send('Profile Service is running'));

// Get User Profile
app.get('/:userId', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM profiles WHERE user_id = ?', [req.params.userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.post('/', async (req, res) => {
  const { user_id, full_name, skills, bio } = req.body;
  try {
    await pool.execute(
      'INSERT INTO profiles (user_id, full_name, skills, bio) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE full_name=?, skills=?, bio=?',
      [user_id, full_name, skills, bio, full_name, skills, bio]
    );
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Profile Service running on port ${PORT}`));
