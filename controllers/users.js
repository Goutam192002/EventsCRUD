const User = require('../models/users').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const index = async (req, res) => {
  // send all the users here
  try {
    const users = await User.find().select('_id username name email');
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'Something went wrong...Please try again later'
    })
  }
};

const create = async (req, res) => {
  let {
    username,
    name,
    email,
    password
  } = req.body;

  try {
    const user = new User({
      username: username,
      name: name,
      email: email,
      password: password
    });
    await user.save();
    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Could not create user...Please try again some time later'
    })
  }
};

const findUser = async (req, res) => {
  const userID = req.params.userID;
  try {
    const user = await User.findOne({ _id: userID }).select('username name email');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Could not find user'
    })
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email}).select('name username email password');
    if(await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({
        name: user.name,
        id: user._id,
        username: user.username,
        email: user.email
      }, secret);
      res.status(200).json(token)
    } else {
      res.status(500).json({
        error: true,
        message: 'Wrong email or password...Please try again'
      })
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Something went wrong...Please try again later after some time'
    })
  }
};

const createdEvents = async (req, res) => {
  const userID = req.params.userID;
  try {
    const events = await User.findOne({ _id: userID}).populate('createdEvents').select('createdEvents -_id');
    res.status(200).json(events.createdEvents);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Something went wrong..Please try again later after some time'
    })
  }
};

const invites = async (req, res) => {
  const userID = req.params.userID;
  try {
    const events = await User.findOne({ _id: userID}).populate('invites').select('invites -_id');
    res.status(200).json(events.invites);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Something Went wrong...Please try again later after some time.'
    })
  }
};

module.exports = {
  index,
  create,
  findUser,
  authenticateUser,
  createdEvents,
  invites
};
