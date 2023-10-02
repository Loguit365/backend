const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongodb=require('mongodb');
const ObjectID=mongodb.ObjectId;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoURL = 'mongodb://127.0.0.1:27017'; 
const dbName = 'Task'; // 

// Database Connection
const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

const db = client.db(dbName);

// Get all data
app.get('/user', async (req, res) => {

  console.log("hello logu");
  try {
    const collection = db.collection('user');
    const result = await collection.find({}).toArray();
    console.log(result);
    res.send({
      message: 'All user data',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({
      message: 'Error fetching users',
    });
  }
});

// Get single data
app.get('/user/:id', async (req, res) => {
  
    
    const userId = req.params.id;
    console.log(userId);
    const collection = db.collection('user');
    const cursor=collection.find({});
    const array=await cursor.toArray();
    const result = await collection.findOne({ _id: new ObjectID(userId) });
    console.log(result)
    res.send({
        message: 'Single user data is found',
        data:result,
      });
    
  
});

// Create data
app.post('/user', (req, res) => {
  const collection = db.collection('user');
  const newUser = req.body;
  collection.insertOne(newUser, (err) => {
    if (err) {
      console.error('Error inserting data into MongoDB:', err);
      res.status(500).send({ message: 'Internal Server Error' });
      return;
    }
    res.send({
      message: 'Data inserted',
    });
  });
});

// Update single data
app.put('/user/:id', async (req, res) => {
  console.log("logu")
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const collection = db.collection('user');
    const result = await collection.updateOne({_id: new ObjectID(userId) }, { $set: updatedUser });
    console.log(result)
    if (result.modifiedCount === 1) {
      res.send({
        message: 'Data updated',
      });
    } else {
      res.send({
        message: 'Datas not found',
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({
      message: 'Error updating user',
    });
  }
});



app.delete('/user/:id', async (req, res) => {
  console.log("hello");
  try {
    const userId = req.params.id;
    console.log('Received ID:', userId); 

    const collection = db.collection('user');
    const result = await collection.deleteOne({ _id: new ObjectID(userId) });
    res.send({
      message: 'Data Deleted',
    });

   
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({
      message: 'Error deleting user',
    });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Close the MongoDB connection on app termination
process.on('SIGINT', () => {
  client.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});


