const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String,
});

//we are making a model or collection named Book
//This collection will have object inside of it which looks like bookSchema
module.exports = mongoose.model('Book', bookSchema);