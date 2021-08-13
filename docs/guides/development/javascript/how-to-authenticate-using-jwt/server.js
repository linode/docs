// Import the NPM packages to be used.
const express = require('express');
const jwt = require('jsonwebtoken');

// Initialize the Express JS application and configure its port number.
const app = express();
const port = 3000;

// Create a secret to be used for signing the JWTs.
const jwtSecret = "example-secret";

// Create an array with user login credentials and information.
// Typically, you would likely fetch this information from a database,
// and ideally the password would be stored encrypted.
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


// Add an endpoint for incoming authentication requests.
app.get('/auth', (req, res) => {
    res.send(fetchUserToken(req));
});

// Add an endpoint for user information requests. The endpoint first
// verifies the JWT. If it is valid, it makes the call to fetch the
// user's information.
app.get('/userInfo', (req, res) => {
    jwt.verify(req.query.token, jwtSecret, (err, decodedToken) => {
        if (err) {
            res.send(err);
        } else {
            res.send(fetchUserInfo(decodedToken.sub));
        }
    });
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
                {expiresIn: 120}
            );
        }
    }

    return "Error: No matching user credentials found.";
}

// Fetch the user information matching the user ID in the request.
const fetchUserInfo = (userId) => {
    for (i=0; i<userCredentials.length; i++) {
        if (userCredentials[i].userId == userId) {
            return userCredentials[i].userInfo;
        }
    }

    return "Error: Unable to fulfill the request.";
}

// Have the Express JS application begin listening for requests.
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})
