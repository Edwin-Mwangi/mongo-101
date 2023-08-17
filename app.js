const express = require('express');
const { connectToDb, getDb } = require('./db')

const app = express();

let db

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
    res.json({mssg: "Welcome to page"})
})