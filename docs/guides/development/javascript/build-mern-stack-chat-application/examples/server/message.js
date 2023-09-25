// Set up Mongoose.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema to be used for the MessageModel.
const MessageSchema = new Schema({
  messageText: {
    type: String,
    required: [true, 'This fields is required.'],
  },
});

// Create the message model from the MessageSchema.
const MessageModel = mongoose.model('message', MessageSchema);

module.exports = MessageModel;
