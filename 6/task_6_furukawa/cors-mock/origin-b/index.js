const express = require('express');
const app = express();
const port = 3001;

const ACCESS_CONTROL_ALLOW_ORIGIN = 'http://87cf0c721b07.ngrok.io'

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- */


app.get('simple-cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
  res.json({ message: 'Simple CORS requests are working. [GET]' })
});

app.post('/simple-cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
  res.json({ message: 'Simple CORS requests are working. [POST]' });
});

/* -------------------------------------------------------------------------- */

app.options("/complex-cors", (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': ACCESS_CONTROL_ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
  });
  res.json();
});
app.post('/complex-cors', (req, res) => {
  res.set({ 'Access-Control-Allow-Origin': ACCESS_CONTROL_ALLOW_ORIGIN })
  res.json({ message: 'Complex CORS requests are working. [POST]' });
});

/* -------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(`Server1 listening at http://localhost:${port}`);
});