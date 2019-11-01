const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

// Create validateActionId middleware
function validateActionId(req, res, next){
    const { id } =  req.params;
    actionsDb
    .get(id)
    .then(action => {
      if (action) {
        req.action = action;
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

// Create validateActionPost middleware
function validateActionPost(req, res, next){
    const actionPost = req.body;
  if (!actionPost) {
    res.status(400).json({ message: "missing post data" });
  } 
  else if (!actionPost.project_id) {
    res.status(400).json({ message: "missing required project_id field for the action post" });
  }
  else if (!actionPost.notes) {
    res.status(400).json({ message: "missing required notes field for the action post" });
  } 
  else if (!actionPost.description){
    res.status(400).json({ message: "missing required description field for the action post" });
  }
  else {
    next();
  }
}

//Create validateProjectPostId middleware
function validateProjectPostId(req, res, next){
    const projectPostId = req.body.project_id;
    projectsDb
    .get(projectPostId)
    .then(project => {
      if (project) {
        next();
      } else {
        res.status(400).json({ message: "There is no project with the specified id" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Something terrible happend while checking user id: ${error.message}`
      });
    });

}

//Create a GET / Endpoint
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

  router.post('/', validateActionPost, validateProjectPostId, (req, res) => {
    const { project_id, description, notes } = req.body;
    console.log('action post', req.body)
    const newPost = {
        project_id, description, notes
    }
    actionsDb.insert(newPost)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        res.status(500).json({
            message: `There was an error creating this action post: ${error}`
        })
    })
})

router.put('/:id', validateActionId, validateActionPost, (req, res) => {
    const id = req.params.id;
    const { name, description, notes} = req.body;
    const postToBeUpdate = {
        name, description, notes
    }

    actionsDb
    .update(id, postToBeUpdate)
    .then(() => {
      res.status(200).json({ message: "This user has been updated" });
    })
    .catch(error => {
      res.status(500).json({
        message: `Error updating this post: ${error.message}`
      });
    });

})

router.delete('/:id', validateActionId, (req, res) => {
    const id = req.params.id;
    actionsDb
    .remove(id)
    .then(() => {
      res.status(200).json({ message: "This action has been deleted" });
    })
    .catch(error => {
      res.status(500).json({
        message: `Error deleting this action: ${error.message}`
      });
    });

})

module.exports = router;
