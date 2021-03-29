const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5021;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnv3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  
  app.post('/addEvent', (req,res) => {
    const newEvent = req.body;
    console.log("add new Events", newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.delete('/deleteItem/:id', (req,res) =>{
   const id = ObjectID(req.params.id);
   eventCollection.findOneAndDelete({_id: id})
   .then(result => {
     res.send(result.deletedCount > 0);
   })
  })
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})