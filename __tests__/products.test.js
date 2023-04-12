// By default Jest does not work with the import syntax
// If you want to use import syntax you should add NODE_OPTIONS=--experimental-vm-modules to the test script in package.json
// On Windows you cannot use NODE_OPTIONS (as well as other env vars in scripts) from the command line --> solution is to use cross-env in order to be able to pass
// env vars to command line scripts on all operative systems!
import supertest from "supertest"
import dotenv from "dotenv"
import server from "../src/server.js"

dotenv.config() // This command forces .env vars to be loaded into process.env. This is the way to go when you can't use -r dotenv/config

// supertest is capable of running server.listen from our Express app if we pass the server to it
// It will give us back an object (client) that can be used to run http requests on that server
const client = supertest(server)

describe("Test APIs", () => {
  // it("Should test that GET /test endpoint returns 200 and a body containing a message", async () => {
  //   const response = await client.get("/test")
  //   expect(response.status).toBe(200)
  //   expect(response.body.message).toEqual("TEST SUCCESSFULL")
  // })
  it("Should test that env vars are loaded correctly", () => {
    expect(process.env.MONGO_URL).toBeDefined()
  })
})
