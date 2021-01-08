const express = require("express")
const bodyParser = require("body-parser")
const PORT = 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req, res) => {  const data = {text: 'hello world'}
  res.status(200).json(data)
})

app.post("/", (req,res) =>{
  const senDdata = req.body
  // console.log(req.body.name)
  console.log(senDdata)
  res.status(201).json(senDdata)
})

app.listen(PORT, console.log(`server start loclhost${PORT}`))
