require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

// task-management
// 6E9kQPHWySQS2LUf

const uri = process.env.DB_CONNECT_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db(process.env.DB_NAME).collection("users");
    const taskCollection = client.db(process.env.DB_NAME).collection("tasks");

    // user related working
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // task related working
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    // todo work
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find({}).toArray();
      res.send(result);
    });

    // progress work
    app.get("/tasks/progress", async (req, res) => {
      const query = { category: "progress" };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    // done work
    app.get("/tasks/done", async (req, res) => {
      const query = { category: "done" };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });
    app.patch("/tasks/:id", async (req, res) => {
      const taskData = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const upDateTask = {
        $set: {
          ...taskData,
        },
      };

      const result = await taskCollection.updateOne(query, upDateTask);
      res.send(result);
    });
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task management server open");
});

app.listen(port, () => {
  console.log(`the server running port : ${port}`);
});
