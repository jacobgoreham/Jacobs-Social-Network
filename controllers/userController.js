const db = require("../models");

const userController = {
  // Get all users
  getUser(req, res) {
    db.User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  },
  // Get a user by ID
  async getUserId({ params }, res) {
    db.User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user ID found..." });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create a new user
  createUser({ body }, res) {
    db.User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
  // Delete a user and associated apps
  async deleteUser({ params }, res) {
    db.User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user ID found..." });
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: "user and Posts have been deleted." });
      })
      .catch((err) => res.json(err));
  },

  //UpdateTHE USERRRRRR
  async updateUser({ params, body }, res) {
    db.User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user ID found..." });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //adding a friend
  async addFriend({ params }, res) {
    db.User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user ID found..." });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //Remove friend
  async removeFriend({ params }, res) {
    db.User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user ID found..." });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
