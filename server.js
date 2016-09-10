var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname)));

app.get('*', function (req, res) {
  res.send(path.join(__dirname, 'index.html'));
});

var PORT = process.env.PORT || 8080

app.listen(PORT, function() {
  console.log('Production Express running at localhost: ' + PORT)
});
