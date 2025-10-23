// Set up ExpressJS.
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = 5000;

// Set up Mongoose.
const mongoose = require('mongoose');
const mongoDbUrl = 'mongodb://127.0.0.1/example_database';

// Import MongoDB models.
const MessageModel = require('./models/message.js');

// Connect to the database.
mongoose
  .connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Database connection established.'))
  .catch((err) => console.log('Database connection error: ' + err))
mongoose.Promise = global.Promise;

// Prevent possible cross-origin issues.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Necessary to handle the JSON data.
app.use(bodyParser.json());

// Create endpoints for the frontend to access.
app.get('/messages', (req, res, next) => {
  MessageModel
    .find({}, 'messageText')
    .then((data) => res.json(data))
    .catch(next);
});

app.post('/messages', (req, res, next) => {
  if (req.body.messageText) {
    MessageModel.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({error: "Please provide message text."});
  }
});

// Listen on the port.
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

