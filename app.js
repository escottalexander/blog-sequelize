// we've separated out our app and server. `app`
// is responsible for coodrinating routes and middleware.
// server is responsible for serving the app defined
// in this file.

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const AuthorRouter = require('./routes/authors');
const CommentRouter = require('./routes/comments');
const PostRouter = require('./routes/posts');


// Set up the express app
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use('/authors', AuthorRouter);
app.use('/comments', CommentRouter);
app.use('/posts', PostRouter);

app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

module.exports = app;