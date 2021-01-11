const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {   
    res.cookie('domain', 'server1', { 
      httpOnly: true,
    });
  }
}));

app.listen(port, () => {
  console.log(`Server1 listening at http://localhost:${port}`);
});