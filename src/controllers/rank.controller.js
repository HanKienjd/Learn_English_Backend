const {
  updateTop,
  getLeaderboardWithName,
} = require('../services/rank.service');
const RankLogModel = require('../models/rankLogs.model');
const moment = require('moment');

exports.putUpdateHighScore = async (req, res, next) => {
  try {
    const { name, score } = req.body;
    const { accountId } = req.user;

    if (!accountId) {
      return res.status(500).json({
        message: 'An error occurred, please try again later !',
      });
    }

    const data = await updateTop(accountId, name, score);
    return res.status(200).json(data);
  } catch (error) {
    console.error('PUT UPDATE HIGHT SCORE ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { name } = req.query;
    const { accountId } = req.user;
    if (!Boolean(name)) {
      return res.status(400).json({ message: 'failed' });
    }

    const ranks = await getLeaderboardWithName(name);
    const rankOfUser = ranks.find(r => r.accountId == accountId);

    return res.status(200).json({
      ranks,
      rankOfUser: rankOfUser || undefined,
    });
  } catch (error) {
    console.error('GET LEADERBOARD ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.postRankLog = async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const { game } = req.body;

    if (!accountId || !game) {
      return res.status(500).json({
        message: 'An error occurred, please try again later !',
      });
    }

    const log = await RankLogModel.create({
      accountId,
      game,
    });

    return res.status(200).json(log);
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};

exports.getLastRankLogInDay = async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const { game } = req.query;

    if (!accountId) {
      return res.status(500).json({
        message: 'An error occurred, please try again later !',
      });
    }

    const rankLogs = await RankLogModel.find({
      accountId,
      game,
      createdAt: {
        $gte: moment().startOf('day'),
        $lt: moment(),
      },
    });

    return res.status(200).json(rankLogs);
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred, please try again later !',
    });
  }
};
