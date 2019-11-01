const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

function validateProjectPost(req, res, next){
    let post = req.body;
  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } 
  else if (!post.name) {
    res.status(400).json({ message: "missing required name field for new post" });
  } 
  else if (!post.description){
    res.status(400).json({ message: "missing required description field for new post" });
  }
  else {
    next();
  }
}

function validateProjectId(req, res, next){
    const { id } =  req.params;
    projectsDb
    .get(id)
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

router.get("/:id", validateProjectId, (req, res) => {
    const id = req.params.id;
    projectsDb
      .get(id)
      .then(project => {
        res.status(200).json(project);
      })
      .catch(error => {
        res.status(500).json({
          message: `Error retrieving this particular project: ${error.message}`
        });
      });
  });

  router.get("/:id/action", validateProjectId, (req, res) => {
    const id = req.params.id;
    projectsDb
      .getProjectActions(id)
      .then(project => {
        res.status(200).json(project);
      })
      .catch(error => {
        res.status(500).json({
          message: `Error retrieving this particular project: ${error.message}`
        });
      });
  });

router.post('/', validateProjectPost, (req, res) => {
    const { name, description } = req.body;
    const newPost = {
        name, description
    }
    projectsDb.insert(newPost)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        res.status(500).json({
            message: `There was an error creating this project post: ${error}`
        })
    })
})

router.put('/:id', validateProjectId, validateProjectPost, (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    const postToBeUpdate = {
        name, description
    }

    projectsDb
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

router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    projectsDb
    .remove(id)
    .then(() => {
      res.status(200).json({ message: "This user has been deleted" });
    })
    .catch(error => {
      res.status(500).json({
        message: `Error deleting the user: ${error.message}`
      });
    });

})

module.exports = router;
