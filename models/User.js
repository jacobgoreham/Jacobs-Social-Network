const { Schema, model } = require("mongoose");

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "Username Required...",
    },

    email: {
      type: String,
      unique: true,
      required: "Username Required...",
      match: [/.+@.+\..+/],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.TypesObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJson: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtuals("friendCount").get(function () {
  return this.friends.length;
});

// Initialize our User model
const user = model("user", userSchema);

module.exports = user;
