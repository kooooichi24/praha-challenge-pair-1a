const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(StatusCodes.OK).send(JSON.stringify({text: 'hello world'}));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});