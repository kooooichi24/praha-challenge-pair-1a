const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const port = 8080;

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({text: 'hello world'});
});

app.post('/', (req, res) => {
  console.log(req.body);
  if (req.headers['content-type'] === 'application/json') {
    res.status(StatusCodes.CREATED).json(req.body);
  } else {
    res.status(StatusCodes.BAD_REQUEST).send();
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});