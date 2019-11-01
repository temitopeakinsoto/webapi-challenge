const express = require("express");
const actionsDb = require("../helpers/actionModel");
const projectsDb = require("../helpers/projectModel");
const router = express.Router();

function validateProjectPost(req, res, next){
    let post = req.body;
  if (!post || post === "undefined") {
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

    res.send(newPost);

})

module.exports = router;
