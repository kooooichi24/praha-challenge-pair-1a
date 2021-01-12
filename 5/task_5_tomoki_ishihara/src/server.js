import Express from "express"
import router from "./router"

const server = Express()
server.use(router)

export default server
