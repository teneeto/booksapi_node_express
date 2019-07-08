const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require('./models/bookmodel');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  posting and using body-parser to handle post
bookRouter.route('/books')
  .post((req, res) => {
    const newBook = new Book(req.body);

    //  testing
    //  console.log(newBook);

    newBook.save();
    return res.status(201).json(newBook);
  });

// Real setup for Api using routes
bookRouter.route('/books')
  .get((req, res) => {
    //  Testing String
    /*  const response = { hello: 'this is my book API' };
        res.json(response);
    */

    // Finding a list of api based on keyword
    // add one more parameter 'query' to the book.find function
    // then use array destructure to split out the object array to return separate objects
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => { //  Fetching real Api from mongodb using find function
      if (err) {
        return res.send(err);
      }
      return res.json(books);
    });
  });

//  finding just one item
bookRouter.route('/books/:bookId')
  .get((req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  });


app.use('/api', bookRouter);

// basic setup #test #sending request
app.get('/', (req, res) => {
  res.send('Welcome to my Wayfarer Challenge 1 Api');
});

// starting our server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
