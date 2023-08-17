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

//routes
app.get('/books', (req, res) => {

    let books = []
    //find all books
    db.collection('books')
        .find()//returns cursor...can use forEach or toArray
        .sort({author: 1})
        .forEach(book => books.push(book))
        .then(() => res.status(200).json(books))
        .catch(() => res.status(500).json({error: 'Could not fetch documents'}))
    // res.json({mssg: "Welcome to page"})
})

app.get('/books/:id', (req, res) => {

    //find one book
    db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => res.status(200).json(doc))
        .catch(error => res.status(500).json({error: 'Could not fetch the document'}))
})