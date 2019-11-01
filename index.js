// const server = require('./server.js');

const express = require('express');

const postsRouter = require('./posts/postsRouter.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.listen(4000, () => {
    console.log('\n*** Server Running on http://localhost:4000 ***\n');
});