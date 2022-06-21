const rankApi = require('express').Router();
const rankController = require('../controllers/rank.controller');
const passportConfig = require('../middlewares/passport.middleware');

rankApi.put(
  '/update',
  passportConfig.jwtAuthentication,
  rankController.putUpdateHighScore,
);

rankApi.get(
  '/leaderboard',
  passportConfig.jwtAuthentication,
  rankController.getLeaderboard,
);

rankApi.post(
  '/log',
  passportConfig.jwtAuthentication,
  rankController.postRankLog,
);
rankApi.get(
  '/log',
  passportConfig.jwtAuthentication,
  rankController.getLastRankLogInDay,
);

module.exports = rankApi;
