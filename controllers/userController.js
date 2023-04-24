const { user, Application, Thought, User } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    user
      .find({})
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
    user
      .findOne({ _id: params.id })
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
  async createUser({ body }, res) {
    user
      .create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  // Delete a user and associated apps
  async deleteUser({ params }, res) {
    user
      .findOneAndDelete({ _id: params.id })
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
    user
      .findOneAndUpdate({ _id: params.id }, body, {
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
  addFriend({ params }, res) {
    user
      .findOneandUpdate(
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
  removeFriend({ params }, res) {
    user
      .findOneandUpdate(
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
