const express = require('express');
const path = require('path');

const app = express();
// Set port to use if env doesnt set one
const PORT = process.env.PORT || 5000;

// API
app.get('/api', function(req, res) {
  res.json({"error":"No API functionality defined yet"});
});

// Static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Remaining requests return the React app
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
