// Import React and the stylesheet.
import React from 'react';
import './App.css';

// Import the component to be used for fetching, posting,
// and displaying messages from the server.
import Messages from './Messages';

// Initialize the application display, giving a
// placeholder for the Messages component.
function App() {
  return (
    <div className="App">
      <Messages />
    </div>
  );
}

export default App;
