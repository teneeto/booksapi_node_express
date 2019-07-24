const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
/*  eslint-disable-next-line no-unused-vars */
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 3000;
const Book = require('./models/bookmodel');
const bookRouter = require('./routes/bookRouter')(Book);

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

//  middelewares: an intercept between the request and server, to be moved later
bookRouter.use('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) {
      return res.send(err);
    }
    if (book) {
      req.body = book;
      return next;
    }
    return res.statusCode(404);
  });
});
//  finding just one item
bookRouter.route('/books/:bookId')
  .get((req, res) => res.json(req.book));

bookRouter.route('/books/:bookId')
  .put((req, res) => {
    const { book } = req;
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.read = req.body.read;
    book.save();
    req.book.save((err) => {
      if (error) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .patch((req, res) => {
    const { book } = req;
    /* eslint-disable-next-line no-underscore-dangle */
    if (req.body._id) {
      /* eslint-disable-next-line no-underscore-dangle */
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });

    // checking for possible error - error handling
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .delete((req, res) => {
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }
      else return res.sendStatus(204);
    })
  })


app.use('/api', bookRouter);

// basic setup #test #sending request
app.get('/', (req, res) => {
  res.send('Welcome to my Wayfarer Challenge 1 Api');
});

// starting our server
app.listen(port, () => {
  /*  eslint-disable-next-line no-console */
  console.log(`Server running on port ${port}`);
});
