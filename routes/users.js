const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

/* GET users listing. */
router.get('/', userController.index);
// CREATE A NEW USER
router.post('/', userController.create);
// AUTHENTICATE USER
router.post('/signin', userController.authenticateUser);
// FIND USER BY ID
router.get('/:userID', userController.findUser);
// Events created by a User
router.get('/:userID/createdEvents', userController.createdEvents);
// Invites received for that userid
router.get('/:userID/invites', userController.invites);

module.exports = router;
