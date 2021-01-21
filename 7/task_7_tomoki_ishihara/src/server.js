import Express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = Express()

server.use("/", Express.static(path.join(__dirname, "public")))

server.use(
  "/cache",
  Express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.header("Cache-Control", "private, max-age=86400")
    },
  })
)
server.use(
  "/no-cache",
  Express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.header("Cache-Control", "no-store, max-age=0")
    },
  })
)

export default server
