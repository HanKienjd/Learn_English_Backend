const mongoose = require('mongoose');
const { GAMES } = require('../constant');
const Schema = mongoose.Schema;

const rankLogsSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  game: {
    type: String,
    required: true,
    enum: Object.values(GAMES),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RankLogsModel = mongoose.model('rankLogs', rankLogsSchema);
module.exports = RankLogsModel;
