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

