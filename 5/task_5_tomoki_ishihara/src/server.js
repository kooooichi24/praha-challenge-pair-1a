import Express from "express"
import cookieParser from "cookie-parser"
import ejs from "ejs"
import router from "./router"

const server = Express()
server.use(cookieParser())
server.set("view engine", "ejs")
server.use(router)

export default server
