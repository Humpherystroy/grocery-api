// Importing external packages - Common JS
const express = require("express");
const bodyParser = require("body-parser");
const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId } = require("mongodb").ObjectId;
dataAccessLayer.connect();

// Creating my server
const app = express();

// Installing the body-parser middleware
// Allows us to read JSON from requests
app.use(bodyParser.json());

// Defining our HTTP Resource Methods
// API Endpoints
// Routes

// GET all products
// GET /api/products
app.get("/api/products", async (request, response) => {
  const products = await dataAccessLayer.findAll();

  response.send(products);
});

// GET A SPECIFIC PRODUCT BY ID
// GET /api/products/:id
app.get("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  const productQuery = {
    _id: new ObjectId(productId),
  };
  let product;
  try {
    await dataAccessLayer.findOne(productQuery);
  } catch (error) {
    response.send(`Product with id ${productId} not found`);
    return;
  }
  response.send(product);
});

/*
  product = undefined => false
  !undefined => !false => true
  */

// CREATE A NEW PRODUCT
// POST /api/products { name: 'apples', price: 1.99, category: 'produce' }
app.post("/api/products", async (request, response) => {
  // read the json body from the request
  const body = request.body;

  // Validate the json body to have required properties
  /* Required Properties
    -name
    -price
    -category
    */
  if (!body.name || !body.price || !body.category) {
    response.send(
      "Bad Request. Validations Error. Missing name, price, or category!"
    );

    return;
  }

  await dataAccessLayer.insertOne(body);
  response.send();
});

// UPDATING EXISTING PRODUCT BY ID
// PUT /api/products/id { id: 123, name: 'apples', price: 4.99}
app.put("/api/products/:id", async (request, response) => {
  const productId = request.params.id;
  const body = request.body;

  const productQuery = {
    _id: new ObjectId(productId),
  };
  await dataAccessLayer.updateOne(productQuery, body);

  response.send();
});
// DELETE EXISTING PRODUCY BY ID
// DELETE /api/prodcuts/:id
app.delete("/api/products/:id", async (request, response) => {
  const productId = request.params.id;

  const productQuery = {
    _id: new ObjectId(productId),
  };
  await dataAccessLayer.deleteOne(productQuery);

  response.send();
});

// Starting my server
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
