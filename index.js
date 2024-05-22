const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGODB_DBNAME,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Defining the Tweet schema and model
const tweetSchema = new mongoose.Schema({
  text: { type: String, required: true },
}, { timestamps: true });

const Tweet = mongoose.model('Tweet', tweetSchema);

// Defining routes for creating and fetching tweets
app.post('/tweets', async (req, res) => {
  const { text } = req.body;
  const tweet = new Tweet({ text });
  await tweet.save();
  res.status(201).json(tweet);
});

app.get('/tweets', async (req, res) => {
  const tweets = await Tweet.find().sort({ createdAt: -1 });
  res.status(200).json(tweets);
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});