const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

function validateActionId(req, res, next){
    const { id } =  req.params;
    actionsDb
    .get(id)
    .then(action => {
      if (action) {
        next();
      } else {
        res.status(400).json({ message: "There is no Action with the specified id" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Something terrible happend while checking user id: ${error.message}`
      });
    });
}


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

router.get("/:id", validateActionId, (req, res) => {
    const id = req.params.id;
    actionsDb
      .get(id)
      .then(action => {
        res.status(200).json(action);
      })
      .catch(error => {
        res.status(500).json({
          message: `Error retrieving this particular project: ${error.message}`
        });
      });
  });

module.exports = router;
