const {
  updateTop,
  getLeaderboardWithName,
	getLeaderBoards
} = require('../services/rank.service');

exports.putUpdateHighScore = async (req, res, next) => {
  try {
    const { name, score } = req.body;
    const { accountId } = req.user;
    if (!accountId) {
      return res.status(500).json({
        message: 'An error occurred, please try again later !'
      });
    }

    await updateTop(accountId, name, score);
  } catch (error) {
    console.error('PUT UPDATE HIGHT SCORE ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !'
    });
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { page, limit} = req.query;
    if (!Boolean(page, limit)) {
      return res.status(404).json({ message: 'missing params' });
    }
    const data = await getLeaderBoards({page, limit});

    return res.status(200).json(data);
  } catch (error) {
    console.error('GET LEADERBOARD ERROR: ', error);
    return res.status(500).json({
      message: 'An error occurred, please try again later !'
    });
  }
};
