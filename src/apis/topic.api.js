const topicApi = require('express').Router();
const topicController = require('../controllers/topic.controller');

topicApi.get('/list', topicController.getTopicList);
topicApi.post('/create', topicController.createTopic);
topicApi.delete('/delete', topicController.deleteTopic);
topicApi.put('/update', topicController.updateTopic);
module.exports = topicApi;