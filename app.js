const { connectToDb, getDb } = require('./db')
const express = require('express');
const { ObjectId } = require('mongodb');
const app = express();

let db;

connectToDb( err => {
    if(!err){
        app.listen('3000', () => {
            console.log('listening for requests');
        })
        db = getDb()
    }
})

//middleware to access req body data
app.use(express.json())

//routes
//we'll also use pagination in GET to allow 3bks per page
//the query param we'll look like...the p (after the '?')
//p=0 is page 1,p=1 is page 2...etc
// [http://localhost:3000/books?p=0]

app.get('/books', (req, res) => {
    //getting the query param val..0 if none defined
    const page = req.query.p || 0;
    const booksPerPage = 3;

    let books = []
    //find all books
    db.collection('books')
        .find()//returns cursor...can use forEach or toArray
        .sort({author: 1})
        .skip(page * booksPerPage)//how many bks to skip at a page
        .limit(booksPerPage)//only 3 bks per page
        .forEach(book => books.push(book))
        .then(() => res.status(200).json(books))
        .catch(() => res.status(500).json({error: 'Could not fetch documents'}))
    // res.json({mssg: "Welcome to page"})
})

app.get('/books/:id', (req, res) => {
    //check validity
    if(ObjectId.isValid(req.params.id)){
        //find one book
        db.collection('books')
            .findOne({_id: new ObjectId(req.params.id)})
            .then(doc => res.status(200).json(doc))
            .catch(error => res.status(500).json({error: 'Could not fetch the document'}))
    } else {
        res.status(500).json({error: "Not a valid JSON"})
    }
})

//post data
app.post('/books', (req, res) => {
    const book = req.body
    db.collection('books')
        .insertOne(book)
        .then(result => { //result is the acknowledgement returned
            res.status(201).json(result)
        })
        .catch(err => res.status(500).json({err: "Couldn't create new doc"}))
})

//delete data...use id
app.delete('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(doc => res.status(200).json(doc))
            .catch(error => res.status(500).json({error: 'Could not delete the document'}))
    } else {
        res.status(500).json({error: "Not a valid JSON"})
    }
})

//updating data...changing items 
app.patch('/books/:id', (req,res) => {
    //get updates from the request obj
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
            // takes 2 args the id and the changes to be set
            .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => res.status(200).json(result))
            .catch(error => res.status(500).json({error: 'Could not update the document'}))
    } else {
        res.status(500).json({error: "Not a valid JSON"})
    }
})