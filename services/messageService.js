const Message = require('../models/Message');
const Match = require('../models/Match');

const createMessage = async (matchId, sender, text) => {

    try {
        const newMessage = new Message({ match: matchId, sender, text });
        const message = await newMessage.save();

        const updatedMatch = await Match.findByIdAndUpdate(
            matchId,
            {
                $set: {
                    lastMessage: message._id,
                    lastUpdate: Date.now(),
                },
                $push: {
                    messages: message._id,
                },
            },
            { new: true }
        );
        console.log("Updated match: " + updatedMatch);
        if (!updatedMatch) {
            throw new Error('Match not found');
        }

        return message;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createMessage,
};
