const mongoose = require('mongoose');
const { NUM_OF_SPECIALTY, NUM_OF_TOPICS } = require('../constant');
const Schema = mongoose.Schema;


const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  topicId: {
    type: String,
    required: true,
    enum: Array.from({ length: NUM_OF_TOPICS }, (_, key) => key.toString())
  },
  wordLearn: {
    type: 'Number',
    ref: 'flashCardsLearned',
    

  },
  totalWord: {
    type: 'Number',
    ref: 'word',
  }
});

const TopicModel = mongoose.model('topic', topicSchema);
module.exports = TopicModel;