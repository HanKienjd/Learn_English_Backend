const flashcardApi = require('express').Router();
const flashcardController = require('../controllers/flashcard.controller');
const passportConfig = require('../middlewares/passport.middleware');

flashcardApi.get('/word-pack', passportConfig.jwtAuthentication, flashcardController.getWordPack);
flashcardApi.post('/word-learned', passportConfig.jwtAuthentication, flashcardController.handleLearnedWord);
flashcardApi.get('/word-learned', passportConfig.jwtAuthentication, flashcardController.getSummaryTopicsLearned);
flashcardApi.get('/word-learned/:topicId', passportConfig.jwtAuthentication, flashcardController.getLearnedWordOfTopic);

module.exports = flashcardApi;
