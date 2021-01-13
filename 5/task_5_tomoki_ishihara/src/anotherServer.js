import Express from "express"
import cookieParser from "cookie-parser"

const server = Express()

server.use(cookieParser())

server.use("/images", Express.static("public", {
  setHeaders: (res) => {
    res.cookie("message", "I'm tracking you", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
  }
}))

server.get("/", (req, res) => {
  res.send(`<pre>${JSON.stringify(req.cookies, undefined, 2)}</pre>`)
})

export default server
