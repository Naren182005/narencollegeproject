// Simple test to check if the server can run
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Server is running correctly!');
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
