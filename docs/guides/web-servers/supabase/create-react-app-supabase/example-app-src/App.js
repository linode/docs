// Import React and the stylesheet.
import React from 'react';
import './App.css';

// Import the component to be used for fetching, updating,
// and displaying the shopping list.
import ShoppingList from './ShoppingList';

// Initialize the application display, giving a
// placeholder for the ShoppingList component.
function App() {
  return (
    <div className="App">
      <ShoppingList />
    </div>
  );
}

export default App;

