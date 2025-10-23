// Import the modules for building the application.
const express = require('express');
const mongoose = require('mongoose');

// Define the variables for the application.
const SERVER_PORT = 80;
const DATABASE_URL = "mongodb://mongo-repl-NODE_NUMBER:27017/example-app";

// ---
// Initialize
// ---

// Initialize the Express.js application. Have it use JSON.
const app = express();
app.use(express.json());

// ---
// Data schemas
// ---

// Todo schema.
const todoSchema = new mongoose.Schema(
    {
        description: String
    },
    { collection: "todos" }
);
const Todo = mongoose.model("Todo", todoSchema);

// ---
// Router endpoints
// ---

// GET todo items.
app.get('/todos', async (req, res) => {
    try{
        const todoData = await Todo.find({});
        res.json(todoData);
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
});

// POST a todo.
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({ description: req.body.description });

    try {
        const postResult = await newTodo.save();
        res.status(200).json(postResult);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a todo.
app.delete('/todos/:id', async (req, res) => {
    try {
        const deleteResult = await Todo.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        res.status(200).json(deleteResult);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ---
// Server
// ---

// Initialize a connection to the MongoDB database.
mongoose.connect(
    DATABASE_URL,
    {
        "authSource": "admin",
        "user": "admin",
        "pass": "MONGODB_ADMIN_PASSWORD",
    })
    .then((data) => {
        console.log("Connected to MongoDB database.");

        // Start listening on the designated port.
        app.listen(SERVER_PORT, () => {
            console.log(`Express server running on port ${SERVER_PORT}.`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

