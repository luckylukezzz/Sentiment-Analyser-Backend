
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello ' + process.env.api_key });
});

app.post('/message', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
