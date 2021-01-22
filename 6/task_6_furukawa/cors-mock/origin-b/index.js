const express = require('express');
const app = express();
const port = 3001;

const BASE_URL = 'http://87cf0c721b07.ngrok.io'

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------------------- */

app.head('/simple-cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', BASE_URL);
  res.sendStatus(204).json();
});

app.get('simple-cors', (req, res => {
  res.set('Access-Control-Allow-Origin', BASE_URL);
  res.json({ message: 'Simple CORS requests are working. [GET]' })
}));

app.post('/simple-cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', BASE_URL);
  res.json({ message: 'Simple CORS requests are working. [POST]' });
});

/* -------------------------------------------------------------------------- */

app.options("/complex-cors", (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': BASE_URL,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
  });
  res.json();
});
app.post('/complex-cors', (req, res) => {
  res.set({ 'Access-Control-Allow-Origin': BASE_URL })
  res.json({ message: 'Complex CORS requests are working. [POST]' });
});

/* -------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(`Server1 listening at http://localhost:${port}`);
});