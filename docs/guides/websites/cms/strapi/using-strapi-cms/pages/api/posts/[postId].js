// Import Axios for handling HTTP requests.
import axios from 'axios';

// Reference the environmental variables for Strapi connection.
const requestAddress = process.env.STRAPI_ADDRESS
const requestHeaders = {
  headers: { Authorization: process.env.STRAPI_AUTH_HEADER }
}

// Make the request, and return the result in the response.
export default function handler(req, res) {
  // Grab the post ID variable from the requst path.
  const requestedPostId = req.query.postId;

  axios.get(
      `${requestAddress}/api/posts/${requestedPostId}`,
      requestHeaders)
    .then(response => {
      res.status(200).json(response.data.data);
    });
}

