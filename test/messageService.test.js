const Message = require('../models/Message');
const Match = require('../models/Match');
const { createMessage } = require('../services/messageService');

jest.mock('../models/Message');
jest.mock('../models/Match');

describe('createMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new message and update the match', async () => {
        const matchId = 'matchId';
        const sender = 'sender';
        const text = 'Hello, world!';

        const message = { _id: 'messageId' };
        const updatedMatch = { _id: 'matchId', lastMessage: 'messageId' };

        const saveMock = jest.fn().mockResolvedValueOnce(message);
        const messageInstance = { save: saveMock };

        Message.mockImplementation(() => messageInstance);

        Match.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(updatedMatch);

        const result = await createMessage(matchId, sender, text);

        expect(Message).toHaveBeenCalledTimes(1);
        expect(Message).toHaveBeenCalledWith({
            match: matchId,
            sender,
            text,
        });

        expect(saveMock).toHaveBeenCalledTimes(1);

        expect(Match.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(Match.findByIdAndUpdate).toHaveBeenCalledWith(
            matchId,
            {
                $set: {
                    lastMessage: 'messageId',
                    lastUpdate: expect.any(Number), // Update the expectation to expect a number
                },
                $push: {
                    messages: 'messageId',
                },
            },
            { new: true }
        );

        expect(result).toBe(message);
    });

    test('should throw an error if there is a server error', async () => {
        const matchId = 'matchId';
        const sender = 'sender';
        const text = 'Hello, world!';

        const saveMock = jest.fn().mockRejectedValueOnce(new Error('Server error'));
        const messageInstance = { save: saveMock };

        Message.mockImplementation(() => messageInstance);

        await expect(createMessage(matchId, sender, text)).rejects.toThrow('Server error');

        expect(Message).toHaveBeenCalledTimes(1);
        expect(Message).toHaveBeenCalledWith({
            match: matchId,
            sender,
            text,
        });

        expect(saveMock).toHaveBeenCalledTimes(1);

        expect(Match.findByIdAndUpdate).not.toHaveBeenCalled();
    });

});
