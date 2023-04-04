// Import the stub data to be served by the API.
import { postsData } from '../../../data/posts';

// Create a handler to serve API requests to the endpoint.
export default function handler(req, res) {
  // Extract the postSlug from the query portion of the URL.
  const requestedPostSlug = req.query.postSlug;

  // Provide cases for different kinds of request methods. Optional,
  // but provides a good template for scaling the API.
  switch (req.method) {
    case 'GET':
      // Start with a not-found object.
      let responsePostData = { slug: 'na', name: 'No Such Post', content: 'Error: No such post.' };

      // Search the post data for an object matching the query slug.
      // Overwrite the default object if a match is found.
      for (const i in postsData) {
        if (postsData[i].slug === requestedPostSlug) {
          responsePostData = postsData[i];
        }
      }

      // Provide the success response and matching object.
      res.status(200).json(responsePostData);
      break;
    default:
      // Presenting, the API only implements the GET method.
      res.status(404);
      break;
  }
}
