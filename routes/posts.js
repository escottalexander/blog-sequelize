const express = require('express');
const router = express.Router();

const {
    Author,
    Comment,
    Post
} = require('../models');

// can get all restaurants, but we limit to 50 so we don't
// send back all ~25k records.
router.get('/', (req, res) => Post.findAll(
        // The `include` part will cause each restaurant's grades,
        // if any, to be eager loaded. That means that the
        // related grade data is fetched from the db at the same
        // time as the restaurant data. We need both data sources
        // available for our `.apiRepr` method to work when we call
        // it on each restaurant below.
        {
            limit: 50,
            include: [{
                model: Comment,
                // since we're setting `tableName` in our model definition for `Grade`,
                // we need to use `as` here with the same table name, otherwise
                // Sequelize won't find it.
                as: 'comments'
            }]
        })
    .then(posts => res.json({
        posts: posts.map(post => post.apiRepr())
    }))
);

// can get individual restaurants by id
router.get('/:id', (req, res) => Post.findById(req.params.id, {
        // see notes on `include` from route for `/`, above
        include: [{
            model: Comment,
            // since we're setting `tableName` in our model definition for `Grade`,
            // we need to use `as` here with the same table name, otherwise
            // Sequelize won't find it.
            as: 'comments'
        }, {
            model: Author,
            // since we're setting `tableName` in our model definition for `Grade`,
            // we need to use `as` here with the same table name, otherwise
            // Sequelize won't find it.
            as: 'authors'
        }]
    })
    .then(post => res.json(post.apiRepr()))
);

// can create a new restaurant
router.post('/', (req, res) => {
    // ensure we have required fields
    const requiredFields = ['title', 'content', 'authorId'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    // `.create` creates a new instance and saves it to the db
    // in a single step.
    // http://docs.sequelizejs.com/en/latest/api/model/#createvalues-options-promiseinstance
    return Post
        .create({
            title: req.body.title,
            content: req.body.content,
            author_id: req.body.authorId,
        })
        .then(restaurant => res.status(201).json(restaurant.apiRepr()))
        .catch(err => res.status(500).send({
            message: err.message
        }));
});

// update a restaurant
router.put('/:id', (req, res) => {
    // ensure that the id in the request path and the one in request body match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id.toString())) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        res.status(400).json({
            message: message
        });
    }

    // we only support a subset of fields being updateable.
    // if the user sent over any of the updatableFields, we udpate those values
    // in document
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'authorId'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    return Post
        // all key/value pairs in toUpdate will be updated.
        .update(toUpdate, {
            // we only update restaurants that have the id we sent in.
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

// can delete a restaurant by id
router.delete('/:id', (req, res) => {
    return Post
        .destroy({
            where: {
                id: req.params.id
            }
        })
        .then(restaurant => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

// can retrieve all the grades, if any, for a restaurant
router.get('/:id/comments', (req, res) => {
    return Post
        .findById(req.params.id, {
            // see notes in route for `/` above, for discussion of `include`
            // and eager loading.
            include: [{
                model: Comment,
                // since we're setting `tableName` in our model definition for `Grade`,
                // we need to use `as` here with the same table name
                as: 'comments'
            }]
        })
        .then(post => res.json({
            comments: post.comments.map(comment => comment.apiRepr())
        }));
});

module.exports = router;