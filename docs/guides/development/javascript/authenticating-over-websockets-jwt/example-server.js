// Import the packages the application uses.
const express = require('express');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const url = require('url');

// Initialize the Express JS application, and define the port number it uses.
const app = express();
const port = 3000;

// Define the secret to be used in the JWT signing algorithm.
const jwtSecret = "example-secret";

// Create an array with user login credentials and information.
// Typically, you would likely store this information in a database,
// and ideally the passwords would be stored encrypted.
const userCredentials = [
    {
        "username": "userA",
        "password": "example-password-userA",
        "userId": 1,
        "userInfo": "I am userA."
    },
    {
        "username": "userB",
        "password": "example-password-userB",
        "userId": 2,
        "userInfo": "I am userB."
    },
    {
        "username": "userC",
        "password": "example-password-userC",
        "userId": 3,
        "userInfo": "I am userC."
    }
];

// Have Express JS serve the static files in the `/public` directory.
app.use(express.static('public'));

// Create an endpoint for authentication.
app.get('/auth', (req, res) => {
    res.send(fetchUserToken(req));
});

// Check request credentials, and create a JWT if there is a match.
const fetchUserToken = (req) => {
    for (i=0; i<userCredentials.length; i++) {
        if (userCredentials[i].username == req.query.username
            && userCredentials[i].password == req.query.password) {
            return jwt.sign(
                {
                    "sub": userCredentials[i].userId,
                    "username": req.query.username
                },
                jwtSecret,
                { expiresIn: 900 } // Expire the token after 15 minutes.
            );
        }
    }

    return "Error: No matching user credentials found.";
}

// Have Express JS begin listening for requests.
const expressServer = app.listen(port, () => {
    console.log("Express server listening at http://localhost:" + port);
})

// Define the WebSocket server. Here, the server mounts to the `/ws`
// route of the Express JS server.
const wss = new WebSocket.Server({ server: expressServer, path: '/ws' });

// Create an empty list that can be used to store WebSocket clients.
var wsClients = [];

// Handle the WebSocket `connection` event. This checks the request URL
// for a JWT. If the JWT can be verified, the client's connection is added;
// otherwise, the connection is closed.
wss.on('connection', (ws, req) => {
    var token = url.parse(req.url, true).query.token;

    var wsUsername = "";

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            wsClients[token] = ws;
            wsUsername = decoded.username;
        }
    });

    // Handle the WebSocket `message` event. If any of the clients has a token
    // that is no longer valid, send an error message and close the client's
    // connection.
    ws.on('message', (data) => {
        for (const [token, client] of Object.entries(wsClients)) {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    client.send("Error: Your token is no longer valid. Please reauthenticate.");
                    client.close();
                } else {
                    client.send(wsUsername + ": " + data);
                }
            });
        }
    });
});
