const express = require('express');
const server = express();
const projectsRouter = require('./Routers/projectsRouter.js');
const actionsRouter = require('./Routers/actionsRouter.js');


server.use(express.json());
server.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.originalUrl}`
    );
  next();
});

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Welcome to WebAPI Challenge!</h2>`)
});


module.exports = server;
