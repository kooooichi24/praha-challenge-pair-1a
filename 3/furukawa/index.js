const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = 3000;

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(StatusCodes.OK).send(JSON.stringify({text: 'hello world'}));
});

app.post('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(StatusCodes.CREATED).json(req.body);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});