const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'event'
  }],
  invites: [{
    type: Schema.Types.ObjectId,
    ref: 'invite'
  }]
});

UserSchema.pre("save", async function (next) {
  if(!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 8)
  } catch (err) {
    return next(err);
  }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  if(this.getUpdate().password === undefined) return next();
  try {
    this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, 8)
  } catch (err) {
    return next(err);
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema)
};
