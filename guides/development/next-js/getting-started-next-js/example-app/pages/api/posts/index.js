// Import the stub data to be served by the API.
import { postsData } from '../../../data/posts';

// Create a handler to serve API requests to the endpoint.
export default function handler(req, res) {
  res.status(200).json(postsData);
}
