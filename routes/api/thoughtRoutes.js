const router = require("express").Router();
const {
  getThought,
  getThoughtId,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

// https://localhost:3001/api/thoughts
router.route("/").get(getThought).post(createThought);

// /api/thoughts/:id
router
  .route("/:applicationId")
  .get(getThoughtId)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:id/reactions
router.route("/:applicationId/tags").post(addReaction);

// /api/thoughts/:id/reactions/:id
router.route("/:applicationId/tags/:tagId").delete(removeReaction);

module.exports = router;
