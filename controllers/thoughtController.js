const { user, Thought } = require("../models");

module.exports = {
  // Get all Thoughts
  async getThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  },
  // Get a Thought by ID
  async getThoughtId({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No Thought ID found..." });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create a new Thought
  async createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return user.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought Created. No User Id..." });
        }
        res.json({ message: "Thought Created" });
      })
      .catch((err) => res.json(err));
  },

  // Delete a Thought and associated apps
  async deleteUser({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No Thought ID found..." });
        }
        return Thought.deleteMany({ _id: { $in: dbThoughtData.thoughts } });
      })
      .then(() => {
        res.json({ message: "Thought and Posts have been deleted." });
      })
      .catch((err) => res.json(err));
  },

  //Update Thought
  async updateUser({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No Thought ID found..." });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //adding a reaction
  addFriend({ params }, res) {
    Thought.findOneandUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No Thought ID found..." });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  //Remove reaction
  removeFriend({ params }, res) {
    Thought.findOneandUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No Thought ID found..." });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
