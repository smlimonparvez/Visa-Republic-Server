const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w3tuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const visaCollection = client.db("visaDB").collection("visas");
    const visaApplicationsCollection = client.db("visa_applications").collection("visa_application_collection");

    // get all visas
    app.get('/visa', async (req, res) => {
      const cursor = visaCollection.find({});
      const visas = await cursor.toArray();
      res.json(visas);
    })

    // get all visas by specific user
    app.get('/my-visa', async (req, res) => {
      const userEmail = req.params.userEmail;
      const query = {userEmail: userEmail};
      const cursor = visaCollection.find(query);
      const visas = await cursor.toArray();
      res.json(visas);
    })


    // get a visa
    app.get('/visa/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const visa = await visaCollection.findOne(query);
      res.json(visa);
    })

    // create a visa
    app.post('/visa', async (req, res) => {
      const newVisa = req.body;
      const result = await visaCollection.insertOne(newVisa);
      res.json(result);
    })

    // update a visa
    app.put('visa/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const updatedVisa = req.body;
      const updateDoc = {
        $set: updatedVisa,
      };
      const result = await visaCollection.updateOne(query, updateDoc);
      res.json(result);
    })

    // Delete a visa
    app.delete('/visa/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await visaCollection.deleteOne(query);
      res.json(result);
    })

    // Apply for a visa
    app.post('/visa-application', async (req, res) => {
      const newApplyVisa = req.body;
      const result = await visaApplicationsCollection.insertOne(newApplyVisa);
      res.json(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})