const express = require("express");
const PORT = 8080;
const app = express();

app.use("/endpoint1", (req,res, next) => {
  console.log("endpoint1")
  next()
},express.static("public"))

app.use("/endpoint2", (req,res, next) => {

  console.log("endpoint2")
  next()
},express.static("public", {
  setHeaders: setCustomCacheControl
}))

function setCustomCacheControl (res, path) {
  console.log("path", path)
  if (path.indexOf("/images") !== -1) {
    console.log("cache")
    res.setHeader('Cache-Control', 'public, max-age=1000')
  }
}

app.get("/endpoint1", (req,res)=>{
 res.sendFile(__dirname + "/public" + "/index.html" )
})

app.get("/endpoint2", (req,res)=>{
  res.sendFile(__dirname + "/public" + "/index.html" )
 })


app.listen(PORT, ()=> {
  console.log(`sever start localhost:${PORT}`)
})
