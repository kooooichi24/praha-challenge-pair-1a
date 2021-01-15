
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 8080;

const corsOptions = {
  // http://localhost:8080 corsの制約に引っ掛けたい時は、このオリジンにする
  origin: 'http://localhost:8082',
  mode: "cors",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.post('/hello', function (req, res, next) {
  res.json({result: '任意のオリジンからすべてのAPIがアクセスOK'})
})

app.listen(PORT, () => {
  `server start listen localhost${PORT}`
})

const PORT2 = 8082

const app2 = express();

app2.use(express.static("public2"))

app2.listen(PORT2,() => {
  console.log(`server start${PORT2}`)
})