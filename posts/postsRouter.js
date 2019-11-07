const express = require('express');
const router = express.Router();
const db = require('../data/db.js');

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(error => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            });
    }
    
});

router.post('/:apple/comments', (req, res) => {
    console.log(req.params);
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        req.body.post_id = req.params.apple;
        console.log(req.body);
        db.insertComment(req.body)
            .then(ids => {
                if (ids) {
                    res.status(201).json(ids);
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" });
            });
    }
    
});

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await db.findPostComments(req.params.id);

        if (comments.length > 0) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = await db.remove(req.params.id);
        if (id) {
            res.status(200).json(id);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "The post could not be removed" });
    };
});

router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.update(req.body)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: "The post information could not be modified." });
            });
    }
    
});


module.exports = router;