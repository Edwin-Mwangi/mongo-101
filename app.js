const express = require('express');

const app = express();

app.listen('3000', () => {
    console.log('listening for requests');
})

//routes
app.get('/books', (req, res) => {
    res.json({mssg: "Welcome to page"})
})