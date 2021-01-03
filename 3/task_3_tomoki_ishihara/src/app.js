const express = require("express")
const app = express()
const PORT = 8000

app.get("/", (_, response) => {
  response.send({ text: "hello world" })
})

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`)
})
