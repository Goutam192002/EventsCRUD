const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  invites: [{
    type: Schema.Types.ObjectId,
    ref: 'invite'
  }]
});

module.exports = {
  event: mongoose.model('event', EventSchema)
};
