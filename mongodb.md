# basic mongosh commands

## basic

* clear screen
````
>cls
````

* to see current db you're in
```
>db
```
* to show collection in db
```
>show collections
```
* to switch db 
```mongodb
test> use bookstore
switched to db bookstore
bookstore>
```
## Intermediate commands


* to reference collection in db `bookstore`
````
bookstore> db.books
bookstore.books

````
* to add 1 document in db you're in
```
bookstore> db.books.insertOne({
    title: "damages",
    pages: 300
})
```

* to add more than 1 doc(more than 1 obj)
```mongo
bookstore> db.books.insertMany([
    {doc1},{doc2}
    ])
```
* to find documents in db - `collection being books`
```
bookstore> db.books.find()
```
if books(docs) as many.`mongodb` prints out the 1st 20.
to iterate over some more. You use `it` command
``` 
bookstore> it 
```
* to add filter books
```
bookstore> db.books.find({ author: "Terry Pratchett"})
```
you can add more filters eg `age`, `rating` etc

* to find a single doc - `using the id`
```
bookstore> db.books.findOne({ _id: ObjectId(64dea85e426047cf1b25b148),})
```

## Sorting and Limiting data
* counting docs
```
bookstore> db.books.find().count()
bookstore> db.books.find({ author: "Terry Pratchett"}).count()
```
* limiting docs
```
bookstore> db.books.find().limit(3)
```
* sorting docs
```
bookstore> db.books.find().sort({title:1})
bookstore> db.books.find().sort({title:1}).limit(3)
```
## Nested documents

* to insert a doc with nested doc `reviews`
```
bookstore> db.books.insertOne({
        "title": "River and the Source",
        "author": "Margaret Ogola",
        "reviews": [{
            name: "yoshi",
            body: "fiction"
        }],
        "pages": 500,
        "rating": 9
    })
```
## Complex Queries

* filter using comarison ie ` greater than, greater than or equal, less than, less than or equal,`
```
bookstore> db.books.find({rating: {$gt: 7}})
bookstore> db.books.find({rating: {$gte: 7}, author: "Brad Saad"})
bookstore> db.books.find({rating: {$lt: 8}})
bookstore> db.books.find({rating: {$lte: 4}})
```
* using the `or` operator - find one thing or another
```
bookstore> db.books.find( { $or: [
    {rating: 7}, {rating: 7}
    ]})
bookstore> db.books.find( { $or: [
    {pages: {$gt: 300}, {pages: {$lt: 700}
    ]})
```

* using `$In` and `$Nin` to check if a particular field is in a range of vals
```
//previously..using or
bookstore> db.books.find({$or; [{rating: 7}, {rating: 8}, {rating: 9}]})

//now using $In
bookstore> db.books.find({rating: {$in: [7,8,9]}})
//$Nin
bookstore> db.books.find({rating: {$nin: [7,8,9]}})
```
## Queries and Arrays
Say your Object val in a `document` is an array. if you use `db.books.find({genres: "Fantasy"})` it checks if that value exists in that array unlike other data types where the `key` must match(be equal to) `value` and `key's value` must be a quoted str.

* to find the exact match 
```
bookstore> db.books.find({genres: ["Fantasy"]})

//with fantasy and magic only
bookstore> db.books.find({genres: ["Fantasy", "Magic"]})
```
* to find if all of a specified list is in a doc obj array ie if fantasy and magic are both in the array(the array can have other vals)
```
bookstore> db.books.find({genres: {$all: ["Fantasy", "Magic"]}})
```

* to query an array of nested docs.

`name` is in `reviews` which is nested
```
bookstore> db.books.find({"reviews.name", "luigi"]}}
```
## Deleting Documents
* to delete one.

```
bookstore> db.books.deleteOne({"_id": ObjectId(64dea85e426047cf1b25b148)}}
```
* to delete many
```
bookstore> db.books.deleteMany({author: "Terry Pratchett"})
```

## Updating docs

* to update one
```
bookstore> db.books.updateOne({author: "Terry Pratchett"}, { $set: {rating: 8, pages: 360}})
```
* to update many
```
bookstore> db.books.updateMany({author: "Bradee Said"}, { $set: {author: "Brad Saad"}})
```

## MongoDB  operators
 * to `increment` or `decrement` values
```
//inc by 3 pages
bookstore> db.books.update({_id: ObjectId(64dea85e426047cf1b25b148)}, { inc: {pages: 3}})

//dec by 2 pages
bookstore> db.books.update({_id: ObjectId(64dea85e426047cf1b25b148)}, { inc: {pages: -2}})
```

* `push` and `pull` operators
```
//inc by 3 pages
bookstore> db.books.updateOne({_id: ObjectId(64dea85e426047cf1b25b148)}, { $pull: {genre: "fantasy"}})

//dec by 2 pages
bookstore> db.books.updateOne({_id: ObjectId(64dea85e426047cf1b25b148)}, { $push: {genre: "horror"}})
```

* `each` operator to add multiple vals to array
```
bookstore> db.books.updateOne({_id: ObjectId(64dea85e426047cf1b25b148)},
{ $push: {genre: {$each: ["romance", "sci-fi"]}}})
```

## Indexes
Before we goto `indexes`, we use `explain()` to enquire more about our mongodb operations

```
bookstore> db.books.find({rating:8}).explain('executionStats')
```

* to create `indexes` ie. to index a rating of 8
```
bookstore> db.books.createIndex({rating:8})
```

* to show `indexes` available (stored in array)
```
bookstore> db.books.getIndexes()
```

* to drop/delete `indexes` eg. of rating 8
```
bookstore> db.books.dropIndex({rating:8})
```