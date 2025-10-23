// Import the necessary modules from the Appwrite SDK.
import { Account, Client, Databases } from 'appwrite';

// Create an Appwrite client for connecting to the server.
const appwriteClient = new Client();
const appwriteAccount = new Account(appwriteClient);

// Assign the server's API endpoint and the project ID.
appwriteClient
    .setEndpoint('Your-API-Endpoint')
    .setProject('Your-Project-ID');

// Use the credentials of the react-app-user to connect
// to the Appwrite API. Replace `example-password` with
// the password you used when creating the user.
const appwriteAccountPromise = appwriteAccount.createEmailSession('react-app-user@mail.example.com', 'example-password');

// Have the response printed to the JavaScript console
// for debugging. You can remove this later.
appwriteAccountPromise.then(function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});

// Establish the database to use via its ID. Then
// export the database object so that it can be
// imported by other parts of the React project.
export const appwriteDatabase = new Databases(appwriteClient, 'Your-Database-ID');

