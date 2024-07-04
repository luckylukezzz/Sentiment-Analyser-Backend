// const express = require('express');
// const axios = require('axios');
// // const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = 3000;

require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors')
const app = express();
const mainRouter = require("./routes/user");

app.use(express.json());

app.use(cors())
app.use("/api/v1", mainRouter);

const port = process.env.PORT || 5000;

const start = async () => {

    try {        
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
       console.log(error); 
    }
}

start();





// // Middleware to parse JSON bodies
// app.use(bodyParser.json());
// app.use(cors());

// // Function to get response from Flask app
// async function getFlaskResponse() {
//     try {
//         const response = await axios.get('http://127.0.0.1:5000/');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data from Flask app:', error);
//         return { error: 'Failed to fetch data from Flask app' };
//     }
// }

// // Function to post data to Flask app
// async function postToFlask(data) {
//     try {
//         const response = await axios.post('http://127.0.0.1:5000/analytics', data);
//         return response.data;
//     } catch (error) {
//         console.error('Error posting data to Flask app:', error);
//         return { error: 'Failed to post data to Flask app' };
//     }
// }

// // Define the / endpoint
// app.get('/', async (req, res) => {
//     const data = await getFlaskResponse();
//     res.json(data);
// });

// // Define the /send endpoint for POST requests
// app.post('/send', async (req, res) => {
//     const data = req.body;  // Get the JSON data from the request body
//     const response = await postToFlask(data);
//     res.json(response);
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
