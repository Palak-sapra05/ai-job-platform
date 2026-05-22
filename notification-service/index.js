const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3003;

app.get('/health', (req, res) => res.send('Notification Service is running'));

app.post('/notify', (req, res) => {
  const { userId, message, type } = req.body;
  console.log(`Notification for ${userId}: [${type}] ${message}`);
  res.json({ status: 'sent' });
});

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
