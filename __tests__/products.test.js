// By default Jest does not work with the import syntax
// If you want to use import syntax you should add NODE_OPTIONS=--experimental-vm-modules to the test script in package.json
// On Windows you cannot use NODE_OPTIONS (as well as other env vars in scripts) from the command line --> solution is to use cross-env in order to be able to pass
// env vars to command line scripts on all operative systems!
import supertest from "supertest"
import dotenv from "dotenv"
import mongoose from "mongoose"
import server from "../src/server.js"
import ProductsModel from "../src/api/products/model.js"

dotenv.config() // This command forces .env vars to be loaded into process.env. This is the way to go when you can't use -r dotenv/config

// supertest is capable of running server.listen from our Express app if we pass the server to it
// It will give us back an object (client) that can be used to run http requests on that server
const client = supertest(server)

const validProduct = {
  name: "iPhone",
  description: "Good phone",
  price: 10000,
}

const notValidProduct = {
  description: "Good phone",
  price: 10000,
}

const validUpdate = {
  name: "Google Pixel",
  price: 10001  
}

const notValidUpdate = {
  name: {text: "Iphone"},
  price: "123123"
}

let validId

const invalidId = "123456123456123456123456"

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL)
  const product = new ProductsModel(validProduct)
  await product.save()
})

afterAll(async () => {
  //await ProductsModel.deleteMany()
  await mongoose.connection.close()
})

describe("Test Products API", () => {
  it("Should test that env vars are loaded correctly", () => {
    expect(process.env.MONGO_TEST_URL).toBeDefined()
  })
  it("Should test that GET /products returns 200 and a body", async () => {
    const response = await client.get("/products").expect(200)
    expect(response.body).toBeDefined()
  })
  it("Should test that POST /products returns 201 and an _id if a valid product is provided in req.body", async () => {
    const response = await client.post("/products").send(validProduct).expect(201)
    expect(response.body._id).toBeDefined()
    validId = response.body._id
    console.log("validid is", validId)
  })
  it("Should test that POST /products returns 400 if a not valid product is provided in req.body", async () => {
    await client.post("/products").send(notValidProduct).expect(400)
  })
  it("Should test that GET /products/:id with a valid id returns 204 and a valid body", async () => {
    const response = await client.get(`/products/${validId}`).expect(200)
    expect(response.body).toBeDefined()
    expect(response.body._id).toBe(validId)
  })
  it("Should test that GET /products/:id with an invalid id returns 404", async () => {
    const response = await client.get(`/products/${invalidId}`).expect(404)
  })
  it("Should test that PUT /prodcuts/:id with a valid id to be accepted and that the name gets updated and is String", async () => {
    const response = await client.put(`/products/${validId}`).send(validUpdate).expect(200)
    expect(response.body.name).toBe(validUpdate.name)
    expect(typeof response.body.name).toBe("string")
  })
  it("Should test that PUT /products/:id with an invalid id to return 404", async () => {
    const response = await client.put(`/products/${invalidId}`).send(validUpdate).expect(404)
  })
  test("PUT /products/:id with a valid id but an invalid body returns 400(?)", async () => {
    const response = await client.put(`/products/${validId}`).send(notValidUpdate).expect(400)
  })
/*   it("Should test that DELETE /products/:id with a valid id returns 204", async () => {
    const response = await client.delete(`/products/${validId}`).expect(204)
  }) */
  it("Should test that DELETE /products/:id with an invalid id returns 404", async () => {
    const response = await client.delete(`/products/${invalidId}`).expect(404)
  })
})
