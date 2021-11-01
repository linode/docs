// Import React's Component and Axios.
import React, { Component } from 'react';
import axios from 'axios';

// Create the component for handling messages.
class Messages extends Component {
  // Create an object to hold the list of messages and the message
  // being prepared for sending.
  state = {
    list: [],
    toSend: ""
  };

  // When the component loads, get existing messages from the server.
  componentDidMount() {
    this.fetchMessages();
  }

  // Get messages from the server.
  fetchMessages = () => {
    axios
      .get('/messages')
      .then((res) => {
        if (res.data) {
          this.setState({ list: res.data, toSend: "" });
          let inputField = document.getElementById("textInputField");
          inputField.value = "";
        } else {
          this.setState({ list: ["No messages!"] });
        }
      })
      .catch((err) => console.log(err));
  }

  // Post new messages to the server, and make a call to update
  // the list of messages.
  sendMessage = () => {
    if (this.state.toSend === "") {
      console.log("Enter message text.")
    } else {
      axios
        .post('/messages', { messageText: this.state.toSend })
        .then((res) => {
          if (res.data) {
            this.fetchMessages();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  // Display the list of messages.
  listMessages = () => {
    if (this.state.list && this.state.list.length > 0) {
      return (this.state.list.map((message) => {
        return (
          <p>{message.messageText}</p>
        );
      }))
    } else {
      return (<p>No messages!</p>)
    }
  }

  // Render the message component.
  render() {
    return (
      <div>
        <div>
          <input id="textInputField" type="text" onChange={ (e) => { this.setState({ toSend: e.target.value }) } } />
          <button onClick={this.sendMessage}>Send Message</button>
        </div>
        <div>{ this.listMessages() }</div>
      </div>
    );
  }
}

export default Messages;
