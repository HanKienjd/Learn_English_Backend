const mongoose = require('mongoose');
const {
  REVIEW_STATUS_LOGS,
  NUM_WORDS_LEARN_IN_REVIEW,
} = require('../constant');
const Schema = mongoose.Schema;

const flashCardsLogsSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(REVIEW_STATUS_LOGS),
  },
  topicId: {
    type: String,
    required: true,
  },
  total: {
    // total word in one review
    type: Number,
    default: NUM_WORDS_LEARN_IN_REVIEW,
  },
  reviewed: {
    // the number of words learned in 1 review
    type: Number,
  },
  learned: {
    // the number of words learned in this topic at the time of review
    type: Number,
  },
});

const FlashCardsLogsModel = mongoose.model(
  'flashCardsLogs',
  flashCardsLogsSchema,
);
module.exports = FlashCardsLogsModel;
