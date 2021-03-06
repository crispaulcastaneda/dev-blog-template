const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');


// express app
const app = express();

// Connect to mongoDB
const dbURI = 'mongodb+srv://crispaul:test12345@devblog.6okei.mongodb.net/dev-blog?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    // listen for requests
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


// register view engines
app.set('view engine', 'ejs');

// middleware and static file
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'New Blog',
        snippet: 'The Programmer rules',
        body: 'Blog is different nowadays, working with it.'
    });
    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});

// handler
app.get('/all-blogs', (req, res) => {
    // model.method()
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
});

// handler for single blog
app.get('/single-blog', (req, res) => {
    // model.method()
    Blog.findById("608a9fc63689313ae0632c51")
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
})

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs', (req, res)=> {
    Blog.find().sort( { createdAt: -1 } )
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err)=> {
            console.log(err);
        })
});

// POST Req Method
app.post('/blogs', (req,res) => {
    // use middleware
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        })
});

// redirects
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create' });
});

// Route Parameters
app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch(err => {
            console.log(err);
        })
})

// Delete Request
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => { res.json({ redirect: '/blogs'}) })
        .catch(err => {console.log(err)})
});

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Not Found' });
});