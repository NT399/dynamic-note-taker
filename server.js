const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Helper used to create unique ids for the notes
const uniqueID = require('./helpers/uniqueID');

const port = process.env.PORT || 3001

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for note taker page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */

//function to append the notes to the file
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route used to obtain the notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for note`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route used to post a note

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to post note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uniqueID(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'Successfully posted',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port} 🚀`)
);
