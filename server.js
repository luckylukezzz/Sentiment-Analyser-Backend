
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

const port = 5000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

app.get('/',async(req, res) => {
    try {
      const response = await axios.get('http://112.134.242.37/flask');
      res.json({ message: 'Hello ' + process.env.api_key +response.data});
  } catch (error) {
      res.status(500).send('Error connecting to Flask app');
  }
  res.json({ message: 'Hello '});
});

app.post('/message', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hellozz, ${name}!` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
