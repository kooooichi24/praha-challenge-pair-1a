const express = require('express');
const cookieParser = require('cookie-parser');


const PORT1 = 3000;
const app1 = express();

app1.get("/", (req,res) =>{
  res.cookie("domain origin", req.hostname,{httpOnly: true});
  res.sendFile(__dirname + '/public-1/index.html')
})

app1.listen(PORT1, () => {
  console.log(`server start localhost:${PORT1}`)
})

const PORT2 = 8000;
const app2 = express();

app2.use(express.static('public-2',{
  setHeaders: (res,path, stat) => {
    res.cookie('domain','https://d71d91a3de47.ngrok.io', {
      sameSite: 'none',
      secure: true,
      httpOnly: true
    })
  }
}))

app2.listen(PORT2, () => {
  console.log(`server start localhost:${PORT2}`)
})

