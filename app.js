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
