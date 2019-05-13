//schema describes object types
//relationship between object types
//also how to reach into the data and interact with it. (query retrieve or mutate)

const graphql = require('graphql');
const _ = require("lodash");
const Book = require('../models/book');
const Author = require('../models/author');

const {
        GraphQLObjectType, 
        GraphQLString, 
        GraphQLInt, 
        GraphQLSchema, 
        GraphQLID, 
        GraphQLList,
        GraphQLNonNull,
    } = graphql;

/*
//dummy data
var books = [
    {name: "Name of the Wind", genre: "Fantasy", id: "1", authorID:'1'},
    {name: "The Final Empire", genre: "Fantasy", id: "2", authorID:'2'},
    {name: "The Long Earth", genre: "Sci-Fi", id: "3", authorID:'3'},
    {name: "The Hero of Ages", genre: "Fantasy", id: "4", authorID:'2'},
    {name: "The Colour of Magic", genre: "Fantasy", id: "5", authorID:'3'},
    {name: "The Light Fantastic", genre: "Sci-Fi", id: "6", authorID:'3'},
];

var authors = [
    {name:'Patric Rothfuss', age:44, id:'1'},
    {name:'Brandon Sanderson', age:42, id:'2'},
    {name:'Terry Pratchett', age:66, id:'3'},
];
*/

const BookType = new GraphQLObjectType({
    //name of object type
    name: 'Book',

    //properties of object.
    //it is wrapped in a function with object inside it, to avoid reference errors when having nexted objects. 
    //to avoid code running before defining object. because code runs from top to bottom.
    fields: () => ({
        //need to used types provided by graphql. cant just use String.
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                //console.log(parent);
                //return _.find(authors, { id: parent.authorID });
                return Author.findById(parent.authorId);
            },
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return _.filter(books, { authorID: parent.id });
                return Book.find({ authorId: parent.id });
            }
        }
    })
});



//entry points. root query start point before digging in sub levels
//the query would look something like
/*
book(id:'123'){
    name
    genre
}
*/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //book will be one of the root of queries
        book: {
            type: BookType,
            //when querying for book, I expect them to pass some arguments along.
            args: { id: { type: GraphQLID } },
            //this is the function where we write code to get data from database or some other source
            resolve(parent, args){
                //parent is used in relationships between data
                //args is user passed in values we required above

                //using lodash javascript library to work with javascript objects... makes it easier like jquery
                //it is not requred. can use plain javascript.

                //look throught he books array and find object with id equal to argument id
                //Notice, we are not specifically saying which fields to return from the book
                //GraphQL handles that automatically. Only returns the fields that frontend asks for.
                //return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },

        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                //return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },

        /*
        Because of the relationship setup between BookType and AuthorType, 
        we can also request author of each book
        without adding anything extra to this root query point
        {
            books{
                name
                genre
                author{
                    name
                }
            }
        }
        */
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books;
                return Book.find({});
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                //return authors;
                return Author.find({});
            }
        },
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                //this Author is our model. MongoDB model that we imported
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                //save the local autor object to databse
                //save() also returns the same object back
                //so we can just return that
                return author.save();
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})

//creating new graphql schema. and pass through inital root query
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});