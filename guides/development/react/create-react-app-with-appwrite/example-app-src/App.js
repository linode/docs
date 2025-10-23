// Import React and the stylesheet.
import React from 'react';
import './App.css';

// Import the component to be used for fetching, updating,
// and displaying the list of films from the server.
import Films from './Films';

// Initialize the application display, giving a
// placeholder for the Films component.
function App() {
  return (
    <div className="App">
      <Films />
    </div>
  );
}

export default App;

