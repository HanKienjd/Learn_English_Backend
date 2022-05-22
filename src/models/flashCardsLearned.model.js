const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flashCardsLearned = new Schema({
  accountId: {
    type: String,
    required: true,
    ref: 'account',
  },
  topics: [
    {
      topicId: {
        type: String,
        required: true
      },
      words: [
        {
          wordId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'word'
          },
          createdAt: {
            type: Date,
            required: true,
            default: new Date(),
          },
          updatedAt: {
            type: Date,
            required: true,
            default: new Date(),
          },
        }
      ]
    }
  ],
});

const FlashCardsLearned = mongoose.model(
  'flashCardsLearned',
  flashCardsLearned,
  'flashCardsLearned',
);

module.exports = FlashCardsLearned;
