const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  actionsDb
    .get()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({
        message: `Error retrieving the list of all actions: ${error.message}`
      });
    });
});

module.exports = router;
