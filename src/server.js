import Express from "express"
import cors from "cors"

const server = Express()

// ************************************* MIDDLEWARES **********************************
server.use(cors())
server.use(Express.json())

// ************************************** ENDPOINTS ***********************************
// server.get("/test", (req, res, next) => {
//   res.status(201).send({ message: "TEST SUCCESSFULL" })
// })

// ************************************* ERROR HANDLERS *******************************

export default server
