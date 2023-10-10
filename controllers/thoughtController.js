const { ObjectId } = require('mongoose').Types;
const { Reaction, Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select('-__v');
            
            res.status(200).json(thoughts);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // get single thought
    async getsingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.status(200).json(thought);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findOneAndUpdate(
                { username: thought.username },
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'Thought created but user not found' })
            }

            res.status(200).json(thought);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // update thought info
    async updateThought(req, res) {
        try {
            // only the thoughtText property is updated since thought's user cannot be updated 
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: { thoughtText: req.body.thoughtText } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.status(200).json(thought);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // delete thought 
    async removeThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.status(200).json({
                thought,
                message: 'Thought successfully deleted'
            });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // create a reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.status(200).json({thought});
        }
        catch (err) { 
            return res.status(500).json(err);
        }
    },
    // delete a reaction
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            ).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' })
            }

            res.status(200).json({thought});
        }
        catch (err) { 
            return res.status(500).json(err);
        }
    },
};
