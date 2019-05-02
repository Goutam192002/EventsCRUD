const Event = require('../models/event').event;
const Invite = require('../models/invites').Invite;
const User = require('../models/users').User;

const getAll = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({
        error: true,
        message: 'Something went wrong...Please try again later.'
    })
  }
};

const createEvent = async (req, res) => {
    const { title, description, createdBy } = req.body;
    try {
        const event = new Event({
            title: title,
            description: description,
            createdBy: createdBy
        });
        await event.save();
        User.updateOne({ _id: createdBy }, {
            $push: {
                "createdEvents": event._id
            }
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Something went wrong...Please try again later.'
        })
    }
};

const getEventByID = async (req, res) => {
    const eventID = req.params.eventID;
    try {
        const event = await Event.findOne({ _id: eventID }).select('title description createdBy');
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Something went wrong...Please try again later.'
        })
    }
};

const createInvite = async (req, res) => {
    const eventID = req.params.eventID;
    const { to, from } = req.body;
    try {
        const invite = new Invite({
            event: eventID,
            to: to,
            from: from,
        });
        await invite.save();
        await Event.findOneAndUpdate({ _id: eventID }, {
            $push: {
                "invites": invite._id
            }
        });
        await User.findOneAndUpdate({ _id: to }, {
            $push: {
                "invites": invite._id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Successfully sent invite/s'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Something went wrong...Please try again later'
        })
    }
};

const cancelInvite = (req, res) => {
    const eventID = req.params.eventID;
    const inviteID = req.params.inviteID;

    try {
        const invite = Invite.findOneAndDelete({ _id: inviteID });
        console.log(invite);
        Event.findOne({ _id: eventID }, { $pull: { invites: inviteID }});
        User.findOne({ _id: inviteID.to }, {
            $pull: {
                "invites": inviteID
            }
        });
        res.status(200).json({
            success: true,
            message: 'Something went wrong...Please try again later.'
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Something went wrong...Please try again later.'
        })
    }
};

const getEventInvites = async (req, res) => {
    try {
        const eventID = req.params.eventID;
        const invites = await Event.findOne({ _id: eventID }).populate('invites').invites;
        res.status(200).json(invites);
    } catch (errpr) {
        res.status(500).json({
            error: true,
            message: 'Something Went wrong..Please try again later.'
        });
    }
};

module.exports = {
    getAll,
    getEventByID,
    createEvent,
    createInvite,
    cancelInvite,
    getEventInvites
};

