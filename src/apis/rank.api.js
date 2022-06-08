const rankApi= require('express').Router();
const rankController = require('../controllers/rank.controller');
const passportConfig = require('../middlewares/passport.middleware');
rankApi.put('/update', passportConfig.jwtAuthentication,rankController.putUpdateHighScore);

rankApi.get('/leaderboard', passportConfig.jwtAuthentication , rankController.getLeaderboard);

module.exports = rankApi;
