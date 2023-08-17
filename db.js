const { MongoClient } = require('mongodb')

//define Connection
let dbConnection

//funcs to be exported..
//once to connect, the other to retrieve connection val 
module.exports = {
    connectToDb: (callback) => {
        //local connectionStr has db name in it
        MongoClient.connect("mongodb://localhost:27017/bookstore")//async func returns client
            .then((client) => {
                //connection assigned value of client.db()
                dbConnection = client.db()
                return callback()
            })
            .catch(err => {
                console.log(err)
                return callback(error)
            })
    },
    getDb: () => dbConnection
}