const express = require('express');
const router = express.Router();

const eventController = require('../controllers/events');

// GET all events
router.get('/', eventController.getAll);
// CREATE a new event
router.post('/', eventController.createEvent);
// GET a specific event
router.get('/:eventID', eventController.getEventByID);
// GET list of invites sent for that event
router.post('/:eventID/invite', eventController.getEventInvites);
// Invite people to an event
router.post('/:eventID/invite', eventController.createInvite);
// Cancel invite
router.delete('/:eventID/:inviteID', eventController.cancelInvite);

module.exports = router;
