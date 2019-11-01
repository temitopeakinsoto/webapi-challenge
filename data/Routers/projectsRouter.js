const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  projectsDb
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      res.status(500).json({
        message: `Error retrieving the list of all Projects: ${error.message}`
      });
    });
});

module.exports = router;
