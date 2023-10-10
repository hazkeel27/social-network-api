const { ObjectId } = require('mongoose').Types;
const { Reaction, Thought, User } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');
            
            res.status(200).json(users);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // get single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.status(200).json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body).select('-__v');

            res.status(200).json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // update user info
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.status(200).json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // delete user 
    async removeUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId }).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            // ADD Remove a user's associated thoughts when deleted.

            res.status(200).json({
                user,
                message: 'User successfully deleted'
            });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // add a friend of a user
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.status(200).json({user});
        }
        catch (err) { 
            return res.status(500).json(err);
        }
    },
    // delete a friend of a user
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.status(200).json({user});
        }
        catch (err) { 
            return res.status(500).json(err);
        }
    },
};
