const express = require("express");
const { MongoClient  } = require('mongodb');
const app = express();
app.use(express.json())

app.listen(5000, () => {
    console.log("Server started on port 5000");
});

const uri = 'mongodb://localhost:27017';
const dbName = 'sanjit';
const collectionName = 'debnath';
const client = new MongoClient(uri);

async function insertData(name,age,email) {

    const dataToInsert = {
        name,
        age,
        email
      };
  
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      const result = await collection.insertOne(dataToInsert);
      console.log(result.insertedId);
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      await client.close();
    }
}

async function fetchData() {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Fetch all documents from the collection
    //   const documents = await collection.find({}).toArray();
      const documents = await collection.findOne({ age: "23" });
      return documents;
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      // Close the connection
      await client.close();
    }
  }

app.post('/insert_user', async (req,res) => {
    const {name,age,email} = req.body;
    insertData(name,age,email);
    res.send({status : "ok"})
});

app.get('/fetch_user', async (req,res) => {
    // console.log(await fetchData());
    let result = await fetchData();
    res.send({status : "success",data:result})
});
