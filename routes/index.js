const router = require("express").Router();
const userRoutes = require("userRoutes");
const thoughtRoutes = require("thoughtRoutes");

router.use((req, res) => {
  return res.send("Wrong route!");
});

module.exports = router;
