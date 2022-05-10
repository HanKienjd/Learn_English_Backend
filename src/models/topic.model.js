const mongoose = require('mongoose');
const { NUM_OF_SPECIALTY, NUM_OF_TOPICS } = require('../constant');
const Schema = mongoose.Schema;


const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  total: {
    type: Number,
    default: 0,
  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TopicModel = mongoose.model('topic', topicSchema);
module.exports = TopicModel;