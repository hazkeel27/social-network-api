const { ObjectId } = require('mongoose').Types;
const { Reaction, Thought, User } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = User.find();
            res.json(users);
        }
        catch {
            return res.status(500).json(err);
        }
    },
};
