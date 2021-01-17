const express = require('express');
const app = express();
const port = 3001;

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    res.cookie('domain', 'server2', { 
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}));

app.listen(port, () => {
  console.log(`Server2 listening at http://localhost:${port}`);
});