const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blog_schema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Getting the collections from DB
// First Argument
const Blog = mongoose.model('Blog', blog_schema);
module.exports = Blog; // made mistake here, always check spelling.