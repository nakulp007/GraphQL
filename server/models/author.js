const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: String,
    age: Number,
});

//we are making a model or collection named Author
//This collection will have object inside of it which looks like authorSchema
module.exports = mongoose.model('Author', authorSchema);