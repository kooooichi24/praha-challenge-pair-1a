const express = require('express')
const app = express()
const PORT = 3000

const CACHE_OPTION = {
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': 'private, must-revalidate, max-age=10',
    })
  }
}

const NO_CACHE_OPTION = {
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': `no-store, max-age=0, expires=${new Date()}`,
    })
  }
}

app.use('/', express.static('public'));
app.use('/cache', express.static(__dirname + '/../public', CACHE_OPTION));
app.use('/no-cache', express.static(__dirname + '/../public', NO_CACHE_OPTION));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})