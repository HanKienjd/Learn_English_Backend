const topicApi = require('express').Router();
const topicController = require('../controllers/topics.controller');
const passportConfig = require('../middlewares/passport.middleware');
topicApi.get('/list',passportConfig.jwtAuthentication, topicController.getTopicList);
topicApi.post('/create', passportConfig.jwtAuthentication,topicController.createTopic);
topicApi.delete('/delete', passportConfig.jwtAuthentication,topicController.deleteTopic);
topicApi.put('/update', passportConfig.jwtAuthentication,topicController.updateTopic);
module.exports = topicApi;