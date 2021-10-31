const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

//pass: DgKymP1gaovDl5E3
//user:firstUserDb

const uri = "mongodb+srv://firstUserDb:DgKymP1gaovDl5E3@cluster0.8s3t0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("foodmaster");
      const usersCollection = database.collection("users");


      //GET User
    app.get('/users', async(req, res) =>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    })

    app.get('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const user = await usersCollection.findOne(query);
        
        console.log('Requested id id', id);
        res.send(user)
    })
      //POST API
      app.post('/users', async(req, res) =>{
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        console.log('Got New User', req.body);
        console.log('Added new user', result);
        res.json(result);
      })

      //Update User

      app.put('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert : true};
        const updateDoc = {
            $set:{
                name: updatedUser.name,
                email: updatedUser.email
            }, 
        };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        console.log('update user ', req);
        res.json(result);
      })

      //Delete API

      app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await usersCollection.deleteOne(query);
          console.log('deleteing the user', result);
          res.json(result);
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('running curd server');
});

app.listen(port, ()=>{
    console.log('Running server on port 5000')
})
