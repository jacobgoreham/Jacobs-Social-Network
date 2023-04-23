const { Application, User } = require("../models");

module.exports = {
  async getApplications(req, res) {
    try {
      const applications = await Application.find();
      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleApplication(req, res) {
    try {
      const application = await Application.findOne({
        _id: req.params.applicationId,
      });

      if (!application) {
        return res.status(404).json({ message: "No application with that ID" });
      }

      res.json(application);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the createApplication method
  async createApplication(req, res) {
    //sets up the application to create, sets up the user and has built the user object
    try {
      const application = await Application.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { applications: application._id } },
        { new: true }
      );
      //checks for user ID
      if (!user) {
        return res.status(404).json({
          message: "Application created, but found no user with that ID",
        });
      }
      //if there's no issue with user id creates the application
      res.json("Created the application 🎉");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the updateApplication method
  async updateApplication(req, res) {
    //builds application update route
    try {
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      //checks for app and if no id will log that
      if (!application) {
        return res
          .status(404)
          .json({ message: "No application with this id!" });
      }
      //if application works then jsons application, if not catches error
      res.json(application);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the deleteApplication method
  async deleteApplication(req, res) {
    //(req, res)
    try {
      const application = await Application.findOneAndRemove({
        _id: req.params.applicationId,
      });
      //sets up the one and remove route
      if (!application) {
        return res
          .status(404)
          .json({ message: "No application with this id!" });
      }
      //if no application it'll announce that

      const user = await User.findOneAndUpdate(
        { applications: req.params.applicationId },
        { $pull: { applications: req.params.applicationId } },
        { new: true }
      );
      //Above is the user object getting updated

      if (!user) {
        return res.status(404).json({
          message: "Application created but no user with this id!",
        });
      }
      //error for application created with no user id

      //completed
      res.json({ message: "Application successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
      //err
    }
  },
  // TODO: Add comments to the functionality of the addTag method
  async addTag(req, res) {
    //waits for the updated application
    try {
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $addToSet: { tags: req.body } },
        { runValidators: true, new: true }
      );
      //if no application with ID
      if (!application) {
        return res
          .status(404)
          .json({ message: "No application with this id!" });
      }
      //Jsons application response
      res.json(application);
    } catch (err) {
      res.status(500).json(err);
      //err
    }
  },
  // TODO: Add comments to the functionality of the addTag method
  async removeTag(req, res) {
    //Applications update
    try {
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $pull: { tags: { tagId: req.params.tagId } } },
        { runValidators: true, new: true }
      );

      //if no application with ID
      if (!application) {
        return res
          .status(404)
          .json({ message: "No application with this id!" });
      }

      res.json(application);
    } catch (err) {
      //err
      res.status(500).json(err);
    }
  },
};
