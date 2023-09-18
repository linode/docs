// Create a button element.
const buttonElement = document.createElement("button");
const buttonElementText = document.createTextNode("Click Me!");
buttonElement.appendChild(buttonElementText);

// Add a 'click' event to that button element.
buttonElement.addEventListener("click", () => {
    alert("The button has been clicked!");
});

// Insert the button element into the body of the web page.
document.body.appendChild(buttonElement);
